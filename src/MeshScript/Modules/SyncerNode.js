import {Node} from "../Core/Node";
export class SyncerNode extends Node{
  constructor(options){
    super(options);
    this.editor.parameters = [
      {type:"float",key:"awaits",name:"N° of nodes required"}
    ];
    this.outputs["output"]=[];
    this.triggedLinksId=[];
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
  code(p,o){
    if(this.triggedLinksId.indexOf(p.linkId)==-1){
      this.triggedLinksId.push(p.linkId);
    }
    if(this.triggedLinksId.length>=(this.options.awaits||2)){
      this.triggedLinksId=[];
      o("output",p);
    }
  }
  reset(){
    this.triggedLinksId=[];
  }
}
