import React from 'react';
import {render} from 'react-dom';
import style from './index.scss';

class App extends React.Component {
  render () {
    return (
      <div  id="main">
        <h1>Welcome to collect.vr</h1>
        <p>Here's some content you can add!</p>
        <p>This is a picture of the element, gallium<br />
          <img src="./assets/gallium.jpg" width="300" alt="Photo of gallium" />
        </p>
        <p>
          <div>This links to a 3D model of the gallium molecule</div>
          <a href="./assets/Molecule.glb">
            <img src="./assets/MoleculeThumbnail.png" width="300" />
          </a>
        </p>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));