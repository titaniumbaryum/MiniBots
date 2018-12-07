import {Node} from "../Core/Node";
export class ClockNode extends Node{
  constructor(options){
    super(options);
    this.editor.parameters = [
      {type:"float",key:"period",name:"Clock period (ms)"}
    ];
    this.outputs["output"]=[];
    this.options.period=typeof this.options.period !== "undefined"?this.options.period:1000;
    var outputs=this.outputs;
    var clock=setInterval(function(){
      for(var i=0;i<outputs["output"].length;i++){
        outputs["output"][i].link.trigger({});
      }
    },this.options.period);
    this.canConnect = false;
  }
  __renderMainBody(ctx){
    ctx.beginPath();
    ctx.arc(...this.getPosition(),50,0,2*Math.PI);
    ctx.moveTo(...this.getPosition());
    ctx.lineTo(...this.getPosition().plus([-20,-30]));
    ctx.moveTo(...this.getPosition());
    ctx.lineTo(...this.getPosition().plus([10,-20]));
    ctx.stroke();
  }
  code(p,o){}
}
