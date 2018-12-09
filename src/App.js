import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Editor from './Editor/Editor';
import Tester from './Tester/Tester';
import Field from './Robot/Field';
import Robot from './Robot/Robot';
import {MeshScript} from "./MeshScript/Core/MeshScript";
import {ClockNode} from "./MeshScript/Modules/ClockNode";
import {PulseNode} from "./MeshScript/Modules/PulseNode";
import {ConditionNode} from "./MeshScript/Modules/ConditionNode";
import {DephaserNode} from "./MeshScript/Modules/DephaserNode";
import {SyncerNode} from "./MeshScript/Modules/SyncerNode";
import {Forward,Left,Right} from "./Robot/Nodes/Motion";
import {SensorNode} from "./Robot/Nodes/SensorNode";

let testData = {tiles:[
  ["wall-S","wall-E","source","","","","","","",""],
  ["exit","wall-SEW","","sink","","","","","",""],
  ["","","","","","","","","",""],
],start:[0,2]};
class App extends Component {
  constructor(props){
    super(props);
    const nodes = [ClockNode,PulseNode,ConditionNode,DephaserNode,SyncerNode,Forward,Left,Right,SensorNode];
    for(const node of nodes) MeshScript.registerNodeConstructor(node);
    const nullBot = new Robot(new Field([[""]]),[0,0]);
    window.robot = nullBot;
    this.state={
      mesh:new MeshScript(),
      field:nullBot.field,
      robot:nullBot,
      screen:"editor"
    }
    //binds
    this.setField = this.setField.bind(this);
    this.setScreen = this.setScreen.bind(this);
    this.play = this.play.bind(this);
    this.closePlayField = this.closePlayField.bind(this);
  }
  render() {
    const n =[];
    if(this.state.screen=="editor") n.push(<Editor mesh={this.state.mesh} onPlay={this.play}/>);
    else if(this.state.screen=="tester") n.push(<Tester mesh={this.state.mesh} field={this.state.field} robot={this.state.robot} onClose={this.closePlayField}/>);
    n.push(<ToastContainer
      position="bottom-center"
      autoClose={2000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnVisibilityChange={false}
      draggable={false}
      pauseOnHover={false}
    />);
    return n;
  }
  componentDidMount(){
    this.setField(testData);
  }
  setField({tiles,start}){
    window.robot = new Robot(new Field(tiles),start);
    this.setState((state,props)=>({robot:window.robot,field:window.robot.field}));
  }
  setScreen(screen){
    this.setState((state,props)=>({screen}));
  }
  play(){
    this.setScreen("tester");
    this.state.mesh.reset();
    this.state.mesh.unpause();
    this.state.robot.reset();
  }
  closePlayField(){
    this.setScreen("editor")
    this.state.mesh.pause();
  }
}

export default App;
