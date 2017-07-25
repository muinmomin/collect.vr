class CollectedObject {
  id: number
  ref: string
  title: string
  uniqueID: string
  pos: {
    x: number
    y: number
    z: number
  }
  mesh: BABYLON.Mesh
  COLLECTION_KEY = 'collections';

  constructor(public fileType: string, public src: string) {
    this.uniqueID = this.guid()

    var rawCollections = localStorage.getItem(this.COLLECTION_KEY) ? localStorage.getItem(this.COLLECTION_KEY) : [];

  }

  // Override local getter and setter 

  // Generate unique ID. 
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}

class Space {
  // public _id: number;
  //public _src: string;
  //public _title: string;
  //public _collections: Array<CollectedObject>;
  public _objectMap: Map<string, CollectedObject> = new Map<string, CollectedObject>()

  private COLLECTION_KEY = 'collections';
  private _length: number;

  // TODO: constructor with localstorage
  constructor() {
    var collectionsStr = localStorage.getItem(this.COLLECTION_KEY);
    var collectionsJSON = JSON.parse(collectionsStr);

    this._length = collectionsJSON.length;

    for (var i = 0; i < collectionsJSON.length; ++i) {
      var collectedObject = new CollectedObject(collectionsJSON[i].type, collectionsJSON[i].src);
      this._objectMap[collectedObject.uniqueID] = collectedObject;
    }

  }

  // TODO: override default getter and setter.
}

class Game {
  private _canvas: any;//HTMLCanvasElement;
  private _show3dButton: any;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _webVrCamera: BABYLON.WebVRFreeCamera;
  private _camera: BABYLON.FreeCamera;
  private _light: BABYLON.Light;
  private _cursor: BABYLON.Mesh;
  private _gazeTarget: SelectedObject;
  private objectJump = .8;
  private rotationXState = 0;
  private rotationYState = 0;
  private ray: BABYLON.Ray;
  private _space:Space;
  //private _objectMap:Map<string, CollectedObject> = new Map<string, CollectedObject>()

  constructor(canvasElement: string, show3dButtonElement: string) {
    // Create canvas and engine
    this._canvas = document.getElementById(canvasElement);
    this._show3dButton = document.getElementById(show3dButtonElement);
    this._engine = new BABYLON.Engine(this._canvas, true);

    this._show3dButton.addEventListener('click', () => {
      console.log('show 3d button clicked');
      this.show3d();
    });

    // TODO: A total hack here since we aren't bundling the controller models in our custom babylon build
    BABYLON['windowsControllerSrc'] = '/vrTemplate/assets/controllers/wmr/';
  }

  // load accepts png file and glb file.
  async load(root, name): Promise<BABYLON.Mesh> {
    var fileExtension = name.split('.').pop();

    console.log('url: ' + name);

    if (fileExtension == 'png') {
      return this.loadImage(root, name)
    } else {
      return this.loadModel(root, name)
    }
  }

  // Load 3D model. 
  // root: /
  // name: source of the file. 
  async loadModel(root, name): Promise<BABYLON.Mesh> {
    var p: Promise<BABYLON.Mesh> = new Promise((res, rej) => {
      var parent = new BABYLON.Scene(this._engine)
      BABYLON.SceneLoader.ImportMesh(null, root, name, this._scene, (meshses) => {
        var parent = new BABYLON.Mesh("", this._scene)
        meshses.forEach((m, i) => {
          //console.log(m.parent == this._scene)
          //var other:any = this._scene
          if (!m.parent) {
            console.log("hit")
            m.setParent(parent);
            //m.parent = parent
          }
        })
        res(parent);
      }, null, function (scene, message) {
        rej(message)
      })
      var m = new BABYLON.Mesh(null, null);
    });
    return p;
  }

  // loadImage assumes the file format is .png
  async loadImage(root, name): Promise<BABYLON.Mesh> {
    var p: Promise<BABYLON.Mesh> = new Promise((res, rej) => {
      var filename = name.slice(0, -4);
      var planeName = filename + 'Plane';
      var srcPath = '' + name;
      const size = 1.0;  /* Scaling factor for the image is called size. */
      var imageMaterial = new BABYLON.StandardMaterial(filename, this._scene);
      var image = BABYLON.Mesh.CreatePlane(planeName, size, this._scene, false, BABYLON.Mesh.DEFAULTSIDE);

      imageMaterial.diffuseTexture = new BABYLON.Texture(srcPath, this._scene);
      // image.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
      image.material = imageMaterial;
      var m = new BABYLON.Mesh("", this._scene)
      m.addChild(image)
      res(m)

    });

    return p;

  }

  show3d() {
    this._camera.attachControl(this._canvas, true);
  }

  createCursor() {
    var cursorMaterial = new BABYLON.StandardMaterial("cursor", this._scene);
    cursorMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);

    this._cursor = BABYLON.Mesh.CreateSphere("cursor", 10, 0.3, this._scene);
    this._cursor.material = cursorMaterial;
    this._cursor.isPickable = false;
  }

  updateCursor() {
    if (!this._cursor)
      return;

    var forward = new BABYLON.Vector3(0, 0, -1);
    forward = vecToLocal(forward, this._camera);
    var origin = this._camera.globalPosition;

    var direction = forward.subtract(origin);
    direction = BABYLON.Vector3.Normalize(direction);

    var length = 30;

    this.ray = new BABYLON.Ray(origin, direction, length);
    var ray = this.ray
    var hit = this._scene.pickWithRay(ray, null);

    if (!hit || !hit.pickedMesh) {
      // draw cursor no selection
      this._cursor.position = this._camera.getFrontPosition(length);

      // gaze removed from an object
      if (this._gazeTarget.mesh) {
        this.removeObjectHighlight(this._gazeTarget);
        this._gazeTarget.mesh = undefined;
      }
    } else {
      // selection cursor
      this._cursor.position = hit.pickedPoint;

      // gaze sees a new object
      if (!this._gazeTarget.mesh || this._gazeTarget.mesh != hit.pickedMesh) {
        this._gazeTarget.mesh = hit.pickedMesh;
        var mesh: BABYLON.AbstractMesh = this._gazeTarget.mesh;
        while (mesh.parent != null) {
          var other: any = mesh.parent
          mesh = other
        }
        this._gazeTarget.mesh = mesh
        this.addObjectHighlight(this._gazeTarget);
      }
    }
  }

  removeObjectHighlight(selectedObject) {
    if (!selectedObject.mesh || !selectedObject.mesh.name) {
      console.error("Can't hightlight mesh: " + selectedObject);
      return;
    }

    console.debug("hideMenuOptions for: " + selectedObject.mesh.name);
  }

  addObjectHighlight(selectedObject) {
    if (!selectedObject.mesh || !selectedObject.mesh.name) {
      console.error("Can't hightlight mesh: " + selectedObject);
      return;
    }

    // getObjectDetails(mesh.name);
    console.debug("showMenuOptions for: " + selectedObject.mesh.name);
  }

  toggleZoomObjectMode() {
    if (!this._gazeTarget.mesh) {
      console.debug("No object picked");
      return;
    }

    var mesh: BABYLON.AbstractMesh = this._gazeTarget.mesh;
    console.log(mesh.name)
    console.log(this._space._objectMap[mesh.name])
    if (this._cursor) {
      // zoom in
      this._gazeTarget.positionInCollection = mesh.position.clone();
      mesh.setAbsolutePosition(this._camera.getFrontPosition(this._gazeTarget.GetZoomDistanceToCam()));
      //mesh.scaling = new BABYLON.Vector3(5, 5, 5); - changes the object position weirdly

      // turn off the cursor
      this._cursor.dispose();
      this._cursor = undefined;
    }
    else {
      // zoom out
      //mesh.scaling = new BABYLON.Vector3(1, 1, 1);
      mesh.position = this._gazeTarget.positionInCollection;

      // turn on the cursor back
      this.createCursor();
    }
    BABYLON.Tools.CreateScreenshot(this._engine, this._camera, 512, (base64img) => {
      localStorage.setItem('screenshot', base64img);
    }, 'png');
  }

  async createScene() {
    // create a basic BJS Scene object
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.useRightHandedSystem = true;
    this._space = new Space();
    console.log('space is');
    console.log(this._space);


    var headset = null;
    // If a VR headset is connected, get its info
    if (navigator.getVRDisplays) {
      var displays = await navigator.getVRDisplays()
      if (displays[0]) {
        headset = displays[0];
      }
    }

    if (headset) {
      // Create a WebVR camera with the trackPosition property set to false so that we can control movement with the gamepad
      this._camera = new BABYLON.WebVRFreeCamera("vrcamera", new BABYLON.Vector3(0, 0, 0), this._scene, { trackPosition: true });

      //this._camera.deviceScaleFactor = 1;
    } else {
      // create a FreeCamera, and set its position to (x:0, y:0, z:-10)
      this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, 0), this._scene);
    }

    this.createCursor();
    this._scene.registerBeforeRender(() => { this.updateCursor(); });

    window.addEventListener('keydown', (eventArg) => {
      if (eventArg.key == '`')
        this._scene.debugLayer.show();

      if (eventArg.key == ' ') {
        this.toggleZoomObjectMode();
      }
      if ((eventArg.keyCode == 85 || eventArg.keyCode == 74) && this._gazeTarget) {
        var mesh: BABYLON.AbstractMesh = this._gazeTarget.mesh;
        while (mesh.parent != null) {
          var other: any = mesh.parent
          mesh = other
        }
        var v = this.ray.direction.clone().normalize()//.multiplyByFloats(0.8,)

        if ((eventArg.keyCode == 85)) {
          //v.z*=-1;
          v = v.multiplyByFloats(-1, -1, -1);
        }

        mesh.position.addInPlace(v)
      }

      if (eventArg.keyCode == 87) { //up aka w
        this.rotationXState = 1;
      }
      if (eventArg.keyCode == 65) { //left aka a
        this.rotationYState = -1;
      }
      if (eventArg.keyCode == 83) { //down aka s
        this.rotationXState = -1;
      }
      if (eventArg.keyCode == 68) {  //right aka d
        this.rotationYState = 1;
      }
    });
    window.addEventListener('keyup', (eventArg) => {

      if (eventArg.keyCode == 87 || eventArg.keyCode == 83) { //up or down
        this.rotationXState = 0;
      }
      if (eventArg.keyCode == 65 || eventArg.keyCode == 68
      ) { //left or right
        this.rotationYState = 0;
      }
    });

    // target the camera to scene origin
    this._camera.setTarget(BABYLON.Vector3.Zero());

    // attach the camera to the canvas
    this._camera.attachControl(this._canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);

    // create the skybox cubemap
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 10000, this._scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this._scene);
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("Textures/grad1/grad1", this._scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    skybox.isPickable = false;

    // create the ground (round platform)
    var groundMaterial = new BABYLON.StandardMaterial("ground", this._scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/polar_grid.png", this._scene);
    var ground = BABYLON.Mesh.CreateCylinder("ground", 0.1, 3, 3, 100, 10, this._scene);
    // the user should see the ground below
    ground.position = new BABYLON.Vector3(0, -1.5, 0);
    ground.material = groundMaterial;
    ground.isPickable = false;

    this._gazeTarget = new SelectedObject();

    // TODO: replace the below with localStorage. 
    //var objects:Array<CollectedObject> = []
    // var objectCount = 5
    // for (var i = 0; i < objectCount; i++) {
    //   objects.push(new CollectedObject("3D", "docs/assets/Avocado.glb"))
    // }
    // for (var i = 5; i < 10; i++) {
    //   objects.push(new CollectedObject("2D", "docs/assets/gallium.png"));
    // }

    //var index = 
    console.log(this._space._objectMap)
    for (var key in this._space._objectMap) {
      var o = this._space._objectMap[key]

      console.log(o);
      var index = 0
      //this._space._objectMap[o.uniqueID] = o
      this.load("/", o.src).then((m) => {
        console.log(o.src);
        console.log("loaded")
        o.mesh = m

        m.name = o.uniqueID
        console.log(m.name)

        var size = 0
        var bottom = Infinity

        //Try to get object x size and bottom y pos
        m.getChildMeshes().forEach((c) => {
          var diff = c.getBoundingInfo().boundingBox.maximumWorld.x - c.getBoundingInfo().boundingBox.minimumWorld.x
          var bottomY = c.getBoundingInfo().boundingBox.minimum.y + c.position.y
          if (isFinite(diff) && diff != 0) {
            size = Math.max(size, c.getBoundingInfo().boundingBox.maximumWorld.x - c.getBoundingInfo().boundingBox.minimumWorld.x)
            bottom = Math.min(bottom, bottomY)
          }
        })
        //TODO bottom is incorrect?
        var startPos = new BABYLON.Vector3(0, 0, 0)

        var rowSize = 3
        var rowIndex = index % rowSize
        var colIndex = Math.floor(index / rowSize)
        var rot = -Math.PI / 2 + (Math.PI * (rowIndex / (rowSize - 1)))
        m.position.x = startPos.x + (Math.sin(rot) * 5)//2*(i-objectCount/2)
        m.position.z = startPos.z + (Math.cos(rot) * 5)
        m.position.y = 1 + colIndex * 2

        //Scale to be same size
        var desiredSize = 1
        m.scaling.x = desiredSize / size
        m.scaling.y = desiredSize / size
        m.scaling.z = desiredSize / size
        m.lookAt(new BABYLON.Vector3(0, 1, 0))
        index++
      })
    }

  }

  animate(): void {
    // run the render loop
    this._engine.runRenderLoop(() => {
      if (this._gazeTarget.mesh && (this.rotationXState != 0 || this.rotationYState != 0)) {
        var forward = this.ray.direction;
        let up = BABYLON.Vector3.Cross(BABYLON.Vector3.Cross(new BABYLON.Vector3(0, 1, 0), forward), forward)
        let side = BABYLON.Vector3.Cross(forward, up);
        if (this.rotationXState == 1) {
          this._gazeTarget.mesh.rotate(side, .105, BABYLON.Space.WORLD);

        }
        if (this.rotationXState == -1) {
          this._gazeTarget.mesh.rotate(side, -.105, BABYLON.Space.WORLD);

        }
        if (this.rotationYState == 1) {
          this._gazeTarget.mesh.rotate(up, .105, BABYLON.Space.WORLD);

        }
        if (this.rotationYState == -1) {
          this._gazeTarget.mesh.rotate(up, -.105, BABYLON.Space.WORLD);

        }
      }
      this._scene.render();

    });

    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  // Create the game using the 'renderCanvas'
  let game = new Game('renderCanvas', 'show3dButton');

  // Create the scene
  await game.createScene();

  // start animation
  game.animate();
});

/* Utilities */
class SelectedObject {
  public GetZoomDistanceToCam(): number {
    return 2; // we might want to calculate based on the object size
  }

  public mesh: BABYLON.AbstractMesh;
  public positionInCollection: BABYLON.Vector3;
}

var vecToLocal = function (vector, mesh): BABYLON.Vector3 {
  var m = mesh.getWorldMatrix();
  var v = BABYLON.Vector3.TransformCoordinates(vector, m);
  return v;
}