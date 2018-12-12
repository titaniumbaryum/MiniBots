import {Node} from "../Core/Node";
export class ConditionNode extends Node{
  constructor(options){
    super(options);
    this.editor.parameters = [
      {type:"text",key:"condition",name:"Condition (input parameters as p)"}
    ];
    this.editor.description="this node is intended for developers";
    this.outputs["true"]=[];
    this.outputs["false"]=[];
    this.options.condition=typeof this.options.condition !== "undefined"?this.options.condition:"false";
  }
  __renderMainBody(ctx){
    ctx.beginPath();
    ctx.moveTo(...this.getPosition().plus([  0,-50]));
    ctx.lineTo(...this.getPosition().plus([ 50,  0]));
    ctx.lineTo(...this.getPosition().plus([  0, 50]));
    ctx.lineTo(...this.getPosition().plus([-50,  0]));
    ctx.lineTo(...this.getPosition().plus([  0,-50]));
    ctx.stroke();
  }
  get code(){
    return function(p,output){
      if(eval(this.options.condition)){
        output("true",p);
      }else{
        output("false",p);
      }
    }
  }
}
