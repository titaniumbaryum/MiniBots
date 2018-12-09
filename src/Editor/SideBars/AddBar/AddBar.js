import React, { Component } from 'react';
import ColorCycler from '../../../ColorCycler';
import './AddBar.css';

class AddBar extends Component {
  constructor(props){
    super(props);
    this.__renderNode = this.__renderNode.bind(this);
    this.__addNode = this.__addNode.bind(this);
    this.__dragNode = this.__dragNode.bind(this);
    this.__cc = new ColorCycler();
  }
  __renderNode(c,node){
    const ctx = c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
    ctx.save();
    ctx.translate(c.width/2,c.height/2);
    node.render(ctx,c.color);
    ctx.restore();
  }
  __addNode(c,node){
    const id = Math.round(Math.random()*1000);
    this.props.mesh.nodes[id] = this.__createNode(c,node);
  }
  __createNode(c,node){
    const n = new node({editor:{point:[0,0],color:c.color,name:node.name}})
    c.color = this.__cc.get();
    c.style.color = c.color;
    this.props.onUpdate();
    this.__renderNode(c,node);
    return n;
  }
  __dragNode(e,c,node){
    e.dataTransfer.setData("Node",this.__createNode(c,node));
  }
  render(){
    const dom = [];
    if(this.props.mesh){
      for(let [name,node] of this.props.mesh.constructor.nodeConstructors){
        dom.push(<canvas ref={name} onClick={e=>this.__addNode(e.target,node)} onDragStart={e=>this.__dragNode(e,e.target,node)} draggable="true" width="160" height="160" className="addbar-canvas"/>);
      }
    }
    return <div className="addbar-box">{dom}</div>;
  }
  componentDidMount(){
    if(this.props.mesh){
      for(let [name,node] of this.props.mesh.constructor.nodeConstructors){
        this.refs[name].color = this.__cc.get();
        this.refs[name].style.color = this.refs[name].color;
        this.__renderNode(this.refs[name],node);
      }
    }
  }
}
export default AddBar;
