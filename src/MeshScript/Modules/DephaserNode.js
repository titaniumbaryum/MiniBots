import {Node} from "../Core/Node";
export class DephaserNode extends Node{
  constructor(options){
    super(options);
    this.editor.parameters = [
      {type:"float",key:"period",name:"Delay time (ms)"}
    ];
    this.outputs["output"]=[];
    this.options.period=typeof this.options.period !== "undefined"?this.options.period:1000;
  }
  __renderMainBody(ctx){
    ctx.beginPath();
    ctx.moveTo(...this.getPosition().plus([-40,-50]));
    ctx.lineTo(...this.getPosition().plus([ 40, 50]));
    ctx.lineTo(...this.getPosition().plus([-40, 50]));
    ctx.lineTo(...this.getPosition().plus([ 40,-50]));
    ctx.lineTo(...this.getPosition().plus([-40,-50]));
    ctx.stroke();
  }
  code(p,o){
    const t = setTimeout(function(){
      this.timers.splice(this.timers.indexOf(t), 1);
      o("output",p);
    },this.options.period);
    this.timers.push(t);
  }
  reset(){
    for(const t of this.timers)clearTimeout(this.t);
    this.timers=[];
  }
}
