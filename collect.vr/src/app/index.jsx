import React from 'react';
import {render} from 'react-dom';
import style from './index.scss';

class App extends React.Component {
  render () {
    return <div className='example'><h1> Hello React!</h1></div>;
  }
}

render(<App/>, document.getElementById('app'));