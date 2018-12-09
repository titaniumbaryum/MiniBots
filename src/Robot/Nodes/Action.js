import {Node} from "../../MeshScript/Core/Node";
class Action extends Node{//abstract
  constructor(options){
    super(options);
    this.editor.parameters = [];
    this.outputs[" "]=[];
    this.cancelTokens=[];
  }
  async code(p,o){
    const cancelToken = {canceled: false};
    this.cancelTokens.push(cancelToken);
    await new Promise((res,rej)=>this.timer=setTimeout(res,500));
    if(!cancelToken.canceled){
      window.robot[this.action]();
      console.log(this.action);
    }
    this.cancelTokens.splice(this.cancelTokens.indexOf(cancelToken), 1);
    o(" ",p);
  }
  reset(){
    for(const t of this.cancelTokens)t.canceled=true;
  }
}
export class Charge extends Action{
  constructor(options){
    super(options);
    this.action = "charge";
  }
}
export class Discharge extends Action{
  constructor(options){
    super(options);
    this.action = "discharge";
  }
}
