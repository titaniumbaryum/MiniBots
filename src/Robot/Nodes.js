import {Node} from "../MeshScript/Core/Node";
export class Forward extends Node{
  constructor(options){
    super(options);
    this.editor.parameters = [
      {type:"int",key:"steps",name:"Number of tiles to move"}
    ];
    this.outputs[" "]=[];
    this.options.steps=typeof this.options.steps !== "undefined"?this.options.steps:1;
    this.cancelTokens=[];
  }
  async code(p,o){
    const cancelToken = {canceled: false};
    this.cancelTokens.push(cancelToken);
    for(let i=0;i<this.options.steps;i++){
      await new Promise((res,rej)=>this.timer=setTimeout(res,500));
      if(cancelToken.canceled)break;
      window.robot.forward();
      console.log("forward");
    }
    this.cancelTokens.splice(this.cancelTokens.indexOf(cancelToken), 1);
    o(" ",p);
  }
  reset(){
    for(const t of this.cancelTokens)t.canceled=true;
  }
}
export class Left extends Node{
  constructor(options){
    super(options);
    this.editor.parameters = [
      {type:"int",key:"steps",name:"Number of turns"}
    ];
    this.outputs[" "]=[];
    this.options.steps=typeof this.options.steps !== "undefined"?this.options.steps:1;
    this.cancelTokens=[];
  }
  async code(p,o){
    const cancelToken = {canceled: false};
    this.cancelTokens.push(cancelToken);
    for(let i=0;i<this.options.steps;i++){
      await new Promise((res,rej)=>this.timer=setTimeout(res,500));
      if(cancelToken.canceled)break;
      window.robot.left();
      console.log("left");
    }
    this.cancelTokens.splice(this.cancelTokens.indexOf(cancelToken), 1);
    o(" ",p);
  }
  reset(){
    for(const t of this.cancelTokens)t.canceled=true;
  }
}
export class Right extends Node{
  constructor(options){
    super(options);
    this.editor.parameters = [
      {type:"int",key:"steps",name:"Number of turns"}
    ];
    this.outputs[" "]=[];
    this.options.steps=typeof this.options.steps !== "undefined"?this.options.steps:1;
    this.cancelTokens=[];
  }
  async code(p,o){
    const cancelToken = {canceled: false};
    this.cancelTokens.push(cancelToken);
    for(let i=0;i<this.options.steps;i++){
      await new Promise((res,rej)=>this.timer=setTimeout(res,500));
      if(cancelToken.canceled)break;
      window.robot.right();
      console.log("right");
    }
    this.cancelTokens.splice(this.cancelTokens.indexOf(cancelToken), 1);
    o(" ",p);
  }
  reset(){
    for(const t of this.cancelTokens)t.canceled=true;
  }
}
