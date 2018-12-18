import React, { Component } from 'react';
import ColorCycler from '../../ColorCycler';
import { Point } from '../../utils/Math2d';
import { promisify } from '../../utils/Promises';
import { readFile } from '../../utils/Files';
import Tool from '../../utils/Tool';
import { Link } from "../../MeshScript/Core/Link";
import './Screen.css';

class Screen extends Component {
  constructor(props){
    super(props);
    this.state={
      mesh: props.mesh,
      offset: new Point(),
      zoom: 0,
      tempLink: null,
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
    tool.on("resize",e=>this.forceUpdate());//responsive refresh
    tool.on("menu",e=>{
      const col = this.__findCollisions(e.point,{genOutputs:false,genNodes:true,genLinks:true});
      if(col.nodes.length) this.props.onSelect(col.nodes[0]);
      else if(col.links.length){
        this.state.mesh.removeLink(col.links[0]);
        this.refresh();
      }
      else this.props.onSelect(null);
    });
    tool.on("down",e=>{
      tool.holding={type:"none",node:null,output:null,link:null,downEvent:e}; //reset what the cursor is holding
      const col = this.__findCollisions(e.point,{genOutputs:true,genNodes:true,genLinks:true});//find what the cursor's above
      if(col.outputs.length){//if above output
        tool.holding.type = "output";
        tool.holding.node = col.outputs[0].node;
        tool.holding.output = col.outputs[0].output;
      }else if(col.nodes.length){//if above node
        tool.holding.type = "node";
        tool.holding.node = col.nodes[0];
      }else if(col.links.length){//if above link
        tool.holding.type = "link";
        tool.holding.link = col.links[0];
      }
    });
    tool.on("drag",e=>{
      if(!tool.holding)return;
      if(tool.holding.type == "node"){
        tool.holding.node.setPosition(...tool.holding.node.getPosition().plus(e.delta));//node.position += e.delta
        this.refresh();
      }else if(tool.holding.type == "output"){
        //draw a visual aid for the user
        this.setState((state,props)=>({
          tempLink:{
            start: tool.holding.node.getOutputPosition(tool.holding.output),
            end:e.point,
            color: colorCycler.last
          }
        }));
      }else if(tool.holding.type == "link"){
        //move
      }else if(tool.holding.type == "none"){
        tool.trigger("move",e);
      }
    });
    tool.on("up",e=>{
      if(!tool.holding)return;
      if(e.point.minus(tool.holding.downEvent.point).length<.1){//click
        tool.trigger("menu",e);
      }else if(tool.holding.type == "output"){
        const col = this.__findCollisions(e.point,{genOutputs:false,genNodes:true,genLinks:false});
        if(col.nodes.length && col.nodes[0].canConnect && tool.holding.node!=col.nodes[0]){//if (is above node) and (node can recieve link) and (isn't the start node)
          const id = this.state.mesh.addLink({//creation & instantiation of the link
            start:tool.holding.node,
            output:tool.holding.output,
            end:col.nodes[0],
            editor:{
              color:colorCycler.get()
            }
          });
          this.state.mesh.links[id].pause();
        }
        this.setState((s,p)=>({tempLink:null}));
      }
      tool.holding = null;
    });
    tool.on("leave",e=>{//delete elements when dragged out
      if(!tool.holding)return;
      if(tool.holding.type == "node"){
        this.state.mesh.removeNode(tool.holding.node);
        this.refresh();
      }else if(tool.holding.type == "output"){
        this.setState((s,p)=>({tempLink:null}));
      }else if(tool.holding.type == "link"){
        this.state.mesh.removeLink(tool.holding.link);
        this.refresh();
      }
      tool.holding = null;
    });
    tool.on("move",e=>{
      this.offset = this.offset.plus(e.delta);
    });
    tool.on("zoom",e=>{
      this.zoom += e.delta;
    });
    tool.on("dropin",async e=>{
      for(const item of e.holding){
        if(item.type === "node"){
          const descriptor = await promisify(item.getAsString.bind(item));
          const id = this.props.mesh.addNode(descriptor);
          this.props.mesh.nodes[id].options.editor.point = e.point.clone();
          this.forceUpdate();
        }else if(item.kind === "file" && item.type === "application/json"){
          this.importFile(item.getAsFile());
        }
      }
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
    //render the visual aid when dragging links
    if(this.state.tempLink){
      const {start,end,color} = this.state.tempLink;
      Link.render(ctx,start,end,color);
    }
  }
  __findCollisions(point,{genOutputs=true,genNodes=true,genLinks=true}){
    const outputs = [];
    const nodes = [];
    const links = [];
    if(genOutputs || genNodes){
      for(const [id,node] of this.state.mesh.nodes){
        if(genNodes && point.minus(node.getPosition()).length<50) nodes.push(node);
        for(const [output,links] of node.outputs){
          if(genOutputs && point.minus(node.getOutputPosition(output)).length<15) outputs.push({node,output});
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
  importJSON(json){
    if(typeof json === "string") json = JSON.parse(json);
    this.state.mesh.set(json);
    this.refresh();
  }
  async importFile(file){
    this.importJSON(await readFile(file));
  }
  get zoom(){return this.state.zoom}
  set zoom(amount){
    this.setState((state,props) => {
      return {zoom:amount}
    });
  }
  get offset(){return this.state.offset}
  set offset(amount){
    this.setState((state,props) => {
      return {offset:amount}
    });
  }
  refresh(){
    this.forceUpdate();
  }
}

export default Screen;
