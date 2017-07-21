class Game {
  private _canvas: any;//HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.FreeCamera;
  private _light: BABYLON.Light;

  constructor(canvasElement: string) {
    // Create canvas and engine
    this._canvas = document.getElementById(canvasElement);
    this._engine = new BABYLON.Engine(this._canvas, true);
  }

  async createScene() {
    // create a basic BJS Scene object
    this._scene = new BABYLON.Scene(this._engine);

    var headset;
    // If a VR headset is connected, get its info
    var displays = await navigator.getVRDisplays()
    if (displays[0]) {
      headset = displays[0];
      console.log(headset)
    }
    console.log("hit3")

    if (headset) {
      // Create a WebVR camera with the trackPosition property set to false so that we can control movement with the gamepad
      this._camera = new BABYLON.WebVRFreeCamera("vrcamera", new BABYLON.Vector3(0, 0, -10), this._scene, { trackPosition: false });
      //this._camera.deviceScaleFactor = 1;
    } else {
      // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
      this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this._scene);
    }

    this._scene.onPointerDown = () => {
      console.log("down")
      this._scene.onPointerDown = undefined
      this._camera.attachControl(this._canvas, true);
    }


    // target the camera to scene origin
    this._camera.setTarget(BABYLON.Vector3.Zero());

    // attach the camera to the canvas
    this._camera.attachControl(this._canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);

    // create a built-in "sphere" shape; with 16 segments and diameter of 2
    let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1',
      { segments: 16, diameter: 2 }, this._scene);

    // move the sphere upward 1/2 of its height
    sphere.position.y = 1;

    // create a built-in "ground" shape
    let ground = BABYLON.MeshBuilder.CreateGround('ground1',
      { width: 6, height: 6, subdivisions: 2 }, this._scene);
  }

  animate(): void {
    // run the render loop
    this._engine.runRenderLoop(() => {
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
  let game = new Game('renderCanvas');

  // Create the scene
  await game.createScene();

  // start animation
  game.animate();
});