import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Toast.css';
import './App.css';
import Editor from './Editor/Editor';
import Tester from './Tester/Tester';
import TitleScreen from './TitleScreen/TitleScreen';
import Field from './Robot/Field';
import Robot from './Robot/Robot';
import {MeshScript} from "./MeshScript/Core/MeshScript";
import {ClockNode} from "./MeshScript/Modules/ClockNode";
import {PulseNode} from "./MeshScript/Modules/PulseNode";
import {ConditionNode} from "./MeshScript/Modules/ConditionNode";
import {DephaserNode} from "./MeshScript/Modules/DephaserNode";
import {SyncerNode} from "./MeshScript/Modules/SyncerNode";
import {Forward,Left,Right} from "./Robot/Nodes/Motion";
import {Charge,Discharge} from "./Robot/Nodes/Action";
import {SensorNode} from "./Robot/Nodes/SensorNode";
import levels from "./levels";

class App extends Component {
  constructor(props){
    super(props);
    const nodes = [PulseNode,Forward,Left,Right,Charge,Discharge,SensorNode,SyncerNode,ClockNode,DephaserNode];
    for(const node of nodes) MeshScript.registerNodeConstructor(node);
    const nullBot = new Robot(new Field([[""]]),[0,0]);
    window.robot = nullBot;
    this.state={
      mesh:new MeshScript(),
      field:nullBot.field,
      robot:nullBot,
      screen:"titlescreen"
    }
    //binds
    this.setScreen = this.setScreen.bind(this);
    this.play = this.play.bind(this);
    this.closeTester = this.closeTester.bind(this);
    this.closeEditor = this.closeEditor.bind(this);
    this.selectLevel = this.selectLevel.bind(this);
  }
  render() {
    const screens = {
      "editor" : ()=><Editor mesh={this.state.mesh} onPlay={this.play} onClose={this.closeEditor}/>,
      "tester" : ()=><Tester mesh={this.state.mesh} field={this.state.field} robot={this.state.robot} onClose={this.closeTester}/>,
      "titlescreen" : ()=><TitleScreen levels={levels} onSelect={this.selectLevel}/>,
    }
    const n =[];
    if(this.state.screen in screens)n.push(screens[this.state.screen]());
    else n.push(<h1 style={{textAlign:"center"}}>An error occured</h1>);
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
    return <div className="app-container">{n}</div>;
  }
  componentDidMount(){
  }
  setField({tiles,start}){
    window.robot = new Robot(new Field(tiles),start);
    this.setState((state,props)=>({robot:window.robot,field:window.robot.field}));
  }
  setMesh({mesh}){
    this.state.mesh.set(mesh);
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
  closeTester(){
    this.setScreen("editor")
    this.state.mesh.pause();
  }
  closeEditor(){
    this.setScreen("titlescreen");
  }
  selectLevel(s){
    this.setField(s);
    this.setMesh(s);
    this.setScreen("editor");
  }
}

export default App;
