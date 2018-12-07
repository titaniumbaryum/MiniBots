import {Node} from "../../MeshScript/Core/Node";
export class SensorNode extends Node{
  constructor(options){
    super(options);
    this.editor.parameters = [
      {type:"select",key:"condition",name:"Condition",options:[
        {text:"can move forward",value:"window.robot.inFrontOf()==''||window.robot.inFrontOf()=='exit'"},
        {text:"in front of wall",value:"window.robot.inFrontOf().includes('wall')"},
        {text:"in front of source",value:"window.robot.inFrontOf()=='source'"},
        {text:"in front of sink",value:"window.robot.inFrontOf()=='sink'"},
        {text:"in front of exit",value:"window.robot.inFrontOf()=='exit'"},
        {text:"charged",value:"window.robot.charged"},
      ]}
    ];
    this.outputs["true"]=[];
    this.outputs["false"]=[];
    this.options.condition=typeof this.options.condition !== "undefined"?this.options.condition:this.editor.parameters[0].options[0];
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
      console.log(this.options.condition);
      console.log(eval(this.options.condition));
      if(eval(this.options.condition)){
        output("true",p);
      }else{
        output("false",p);
      }
    }
  }
}
