import React, { Component } from 'react';
import { toast } from 'react-toastify';
import './Editor.css';
import Screen from './Screen/Screen';
import ParamBar from './SideBars/ParamBar/ParamBar';
import AddBar from './SideBars/AddBar/AddBar';
import MenuBar from '../MenuBar/MenuBar';
import MenuBarItem from '../MenuBar/MenuBarItem';

class Editor extends Component {
  constructor(props){
    super(props);

    this.state = {
      mesh:this.props.mesh,
      selectedNode:null,
    };
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
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
      <div className="editor-container open">
        <div className="header editor-element">
          <MenuBar>
            <MenuBarItem onClick={this.props.onPlay} icon="play_arrow" text="Run Script"/>
            <MenuBarItem onClick={this.save} icon="save" text="Save To File"/>
            <MenuBarItem onClick={this.load} icon="eject" text="Load From File"/>
          </MenuBar>
        </div>
        <div className="frame editor-element"><Screen ref="screen" mesh={this.state.mesh} onSelect={this.selectNode}/></div>
        <div className="sidebar editor-element">
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
  load(){
    toast.info('Drag A File On The Coding Area', {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
    });
  }
}

export default Editor;
