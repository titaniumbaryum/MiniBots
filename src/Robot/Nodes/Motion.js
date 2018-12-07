import {Node} from "../../MeshScript/Core/Node";
class Motion extends Node{//abstract
  constructor(options){
    super(options);
    this.editor.parameters = [
      {type:"int",key:"steps",name:"Number of motions"}
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
      window.robot[this.motion]();
      console.log(this.motion);
    }
    this.cancelTokens.splice(this.cancelTokens.indexOf(cancelToken), 1);
    o(" ",p);
  }
  reset(){
    for(const t of this.cancelTokens)t.canceled=true;
  }
}
export class Forward extends Motion{
  constructor(options){
    super(options);
    this.motion = "forward";
  }
}
export class Left extends Motion{
  constructor(options){
    super(options);
    this.motion = "left";
  }
}
export class Right extends Motion{
  constructor(options){
    super(options);
    this.motion = "right";
  }
}
