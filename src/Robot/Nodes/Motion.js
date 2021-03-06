import {Node} from "../../MeshScript/Core/Node";
class Motion extends Node{//abstract
  constructor(options){
    super(options);
    this.editor.parameters = [
      {type:"int",key:"steps",name:"Number of motions"}
    ];
    this.editor.description="Generic Motion";
    this.outputs[" "]=[];
    this.options.steps=typeof this.options.steps !== "undefined"?this.options.steps:1;
  }
  async code(p,o){
    try{
      const t=[];
      for(let i=0;i<this.options.steps;i++){
        t.push(window.robot[this.motion]());
      }
      await Promise.all(t);
    }catch(e){
      console.log(e);
    }
    o(" ",p);
  }
  reset(){}
  __renderMainBody(ctx){
    ctx.beginPath();
    ctx.arc(...this.getPosition(),50,0,2*Math.PI);
    if(this.options.steps>1)ctx.fillText(this.options.steps,...this.getPosition());
    ctx.stroke();
  }
}
Motion.__name = "Motion";
export class Forward extends Motion{
  constructor(options){
    super(options);
    this.motion = "forward";
    this.editor.description="Go forward one or more time";
  }
}
Forward.__name = "Forward";
export class Left extends Motion{
  constructor(options){
    super(options);
    this.motion = "left";
    this.editor.description="Turn left one or more time";
  }
}
Left.__name = "Left";
export class Right extends Motion{
  constructor(options){
    super(options);
    this.motion = "right";
    this.editor.description="Turn right one or more time";
  }
}
Right.__name = "Right";
