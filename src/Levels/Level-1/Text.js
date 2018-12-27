import React from 'react';
import menubar from './menubar.png';
import addbar from './addbar.png';
import mesh from './mesh.png';
export default props=>(
  <div>
    <h1>Welcome to MiniBots!</h1>
    In each Level a Bot needs your help to complete the Level.<br/>
    To do so, you have access to a powerful scripting engine.<br/>
    <h2>The UI</h2>
    <h3>1.Menu-bar</h3>
    <img src={menubar}/><br/>a menu bar containing everything you need to save,reload and test your script
    <h3>2.Node-bar</h3>
    <img src={addbar}/><br/>where you can get <b>Nodes</b> to add to your script.
    <h3>3.Mesh</h3>
    <img src={mesh}/><br/>The script, made of <b>Nodes</b> connected by <b>Links</b>
    <h2>What to do?</h2>
    just click <b><i className="material-icons">play_arrow</i>Run Script</b> and watch the little <b>Bot</b> complete the level.
  </div>
);
