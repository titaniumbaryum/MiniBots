import {Node} from "../../MeshScript/Core/Node";
export class SensorNode extends Node{
  constructor(options){
    super(options);
    this.editor.parameters = [
      {type:"select",key:"condition",name:"Condition",options:[
        {text:"can move forward",value:"a"},
        {text:"in front of wall",value:"b"},
        {text:"in front of source",value:"c"},
        {text:"in front of sink",value:"d"},
        {text:"in front of exit",value:"e"},
        {text:"charged",value:""},
      ]}
    ];
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
