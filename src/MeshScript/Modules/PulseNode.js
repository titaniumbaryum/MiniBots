import {Node} from "../Core/Node";
export class PulseNode extends Node{
  constructor(options){
    super(options);
    this.editor.parameters = [];
    this.outputs[" "]=[];
    this.canConnect = false;
  }
  __renderMainBody(ctx){
    ctx.beginPath();
    const h = Math.sqrt(3)/2;
    ctx.moveTo(...this.getPosition().plus([  0, 50]));
    ctx.lineTo(...this.getPosition().plus([ 50, 50-100*h]));
    ctx.lineTo(...this.getPosition().plus([-50, 50-100*h]));
    ctx.lineTo(...this.getPosition().plus([  0, 50]));
    ctx.stroke();
  }
  code(p,o){}
  reset(){
    for(const output of this.outputs[" "]){
      requestAnimationFrame(()=>output.link.trigger({}));
    }
  }
}
