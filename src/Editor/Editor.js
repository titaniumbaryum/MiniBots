import React, { Component } from 'react';
import './Editor.css';
import Screen from './Screen/Screen';
import ParamBar from './SideBars/ParamBar/ParamBar';
import AddBar from './SideBars/AddBar/AddBar';
import {MeshScript} from "../MeshScript/Core/MeshScript";
import {ClockNode} from "../MeshScript/Modules/ClockNode";
import {ConditionNode} from "../MeshScript/Modules/ConditionNode";
import {DephaserNode} from "../MeshScript/Modules/DephaserNode";
import {SyncerNode} from "../MeshScript/Modules/SyncerNode";

class Editor extends Component {
  constructor(props){
    super(props);
    MeshScript.registerNodeConstructor(ClockNode);
    MeshScript.registerNodeConstructor(ConditionNode);
    MeshScript.registerNodeConstructor(DephaserNode);
    MeshScript.registerNodeConstructor(SyncerNode);
    this.state = {
      mesh:new MeshScript(),
      paused:true,
      selectedNode:null,
    };
    setInterval(()=>{
      if(this.state.paused)this.state.mesh.pause();
      else this.state.mesh.unpause();
    },50);
    this.save = this.save.bind(this);
    this.playPause = this.playPause.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.refresh = this.refresh.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
  }
  selectNode(node){
    this.setState((state,props)=>({selectedNode:node}));
  }
  deleteNode(){
    this.setState((state,props)=>{
      for(const [id,node] of this.state.mesh.nodes){
        if(node == state.selectedNode)delete this.state.mesh.nodes[id];
      }
      for(const [id,link] of this.state.mesh.links){
        if(link.start == state.selectedNode || link.end == state.selectedNode){
          delete this.state.mesh.links[id];
          link.disconnect();
        }
      }
      return {selectedNode:null};
    });
  }
  refresh(){
    this.refs.screen.forceUpdate();
  }
  render() {
    return (
      <div className="app open">
        <div className="header">
          <button onClick={this.save}>save</button>
          <button onClick={this.playPause}>{this.state.paused?"play":"pause"}</button>
        </div>
        <div className="frame"><Screen ref="screen" mesh={this.state.mesh} onSelect={this.selectNode}/></div>
        <div className="sidebar">
          {this.state.selectedNode?
            (<ParamBar node={this.state.selectedNode} onUpdate={this.refresh} onDelete={this.deleteNode}/>):
            (<AddBar mesh={this.state.mesh} onUpdate={this.refresh}/>)
          }
        </div>
      </div>
    );
  }
  save(){
    console.log(this.state.mesh.toString())
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([this.state.mesh.toString()], {type: 'application/json'}));
    a.download = 'mesh.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  playPause(){
    this.setState((state,props)=>{
      return {paused:!state.paused};
    })
  }
}

export default Editor;