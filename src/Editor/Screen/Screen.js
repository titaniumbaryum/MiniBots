import React, { Component } from 'react';
import ColorCycler from '../../ColorCycler';
import { Point } from '../../utils/Math2d';
import Tool from '../../utils/Tool';
import { Link } from "../../MeshScript/Core/Link";
import './Screen.css';
let paper = window.paper;

class Screen extends Component {
  constructor(props){
    super(props);
    this.state={
      mesh: props.mesh,
      offset: new Point(),
      zoom: 0,
    };

  }
  render() {
    return (
      <div ref={s => this.sizer = s} className="sizer">
        <canvas ref={c => this.c = c}></canvas>
      </div>
    );
  }
  componentDidMount(){
    const colorCycler = new ColorCycler();
    const tool = new Tool(this.c);
    tool.on("resize",e=>this.forceUpdate());
    tool.on("menu",e=>{
      const col = this.__findCollisions(e.point,false,true,true);
      if(col.nodes.length) this.props.onSelect(col.nodes[0]);
      else if(col.links.length){
        col.links[0].disconnect();
        for(const [id,link] of this.state.mesh.links){
          if(link == col.links[0])delete this.state.mesh.links[id];
        }
        this.forceUpdate();
      }
      else this.props.onSelect(null);
    });
    tool.on("down",e=>{
      tool.holding={type:"none",node:null,output:null};
      const col = this.__findCollisions(e.point,true,true,false);
      if(col.outputs.length){
        tool.holding.type = "output";
        tool.holding.node = col.outputs[0][0];
        tool.holding.output = col.outputs[0][1];
      }else if(col.nodes.length){
        tool.holding.type = "node";
        tool.holding.node = col.nodes[0];
      }
    });
    tool.on("drag",e=>{
      if(!tool.holding)return;
      if(tool.holding.type == "node"){
        tool.holding.node.setPosition(...tool.holding.node.getPosition().plus(e.delta));
        this.forceUpdate();
      }else if(tool.holding.type == "output"){

      }
    });
    tool.on("up",e=>{
      if(!tool.holding)return;
      if(tool.holding.type == "output"){
        const col = this.__findCollisions(e.point,false,true,false);
        if(col.nodes.length && col.nodes[0].canConnect && tool.holding.node!=col.nodes[0]){
          const link = new Link(tool.holding.node,tool.holding.output,col.nodes[0],{
            editor:{
              color:colorCycler.get()
            }
          });
          link.pause();
          this.state.mesh.links[""+Math.round(Math.random()*1000000)] = link;
          this.forceUpdate();
        }
      }
    });
    tool.on("move",e=>{
      this.setState((state,props) => {
        return {offset:state.offset.plus(e.delta)}
      });
    });
    tool.on("zoom",e=>{
      this.setState((state,props) => {
        return {zoom:state.zoom+e.delta}
      });
    });
    tool.on("dropin",e=>{
      const o = JSON.parse(e.holding);
      const id = Math.round(Math.random()*1000);
      this.props.mesh.nodes[id] = new this.state.mesh.constructor.nodeConstructors[o.type](o);
      this.props.mesh.nodes[id].options.editor.point = [...e.point];
      this.forceUpdate();
    });
    this.componentDidUpdate();
  }
  componentDidUpdate() {
    this.c.width = this.sizer.clientWidth;
    this.c.height = this.sizer.clientHeight;
    const ctx = this.c.getContext("2d");
    ctx.translate(this.c.width/2,this.c.height/2);
    const resizeRatio = this.c.width/1000;
    ctx.scale(resizeRatio,resizeRatio);
    ctx.scale(Math.pow(1.1,this.state.zoom),Math.pow(1.1,this.state.zoom));
    ctx.translate(...this.state.offset)
    for(const [k,v] of this.state.mesh.nodes){
      v.render(ctx);
    }
    for(const [k,v] of this.state.mesh.links){
      v.render(ctx);
    }
  }
  __findCollisions(point,genOutputs=true,genNodes=true,genLinks=true){
    const outputs = [];
    const nodes = [];
    const links = [];
    if(genOutputs || genNodes){
      for(const [id,node] of this.state.mesh.nodes){
        if(genNodes && point.minus(node.getPosition()).length<50) nodes.push(node);
        for(const [output,links] of node.outputs){
          if(genOutputs && point.minus(node.getOutputPosition(output)).length<15) outputs.push([node,output]);
        }
      }
    }
    if(genLinks){
      for(const [id,link] of this.state.mesh.links){
        const v = link.end.getPosition().minus(link.start.getOutputPosition(link.output));
        const lp = point.minus(link.start.getOutputPosition(link.output)).rotate(-v.angle);
        if(Math.abs(lp.y)<10 && lp.x>0 && lp.x<v.length) links.push(link);
      }
    }
    return {outputs,nodes,links};
  }
}

export default Screen;
