import {Node} from "../Core/Node";
export class ClockNode extends Node{
  constructor(options){
    super(options);
    this.editor.parameters = [
      {type:"float",key:"period",name:"Clock period (ms)"}
    ];
    this.editor.description="pulses at a frequency you define";
    this.outputs[" "]=[];
    this.options.period=typeof this.options.period !== "undefined"?this.options.period:1000;
    this.update();
    this.canConnect = false;
  }
  update(){
    clearInterval(this.clock);
    this.clock=setInterval(()=>{
      for(const output of this.outputs[" "]){
        output.link.trigger({});
      }
    },this.options.period);
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
ClockNode.__name = "ClockNode";
