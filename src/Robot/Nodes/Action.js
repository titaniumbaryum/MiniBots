import {Node} from "../../MeshScript/Core/Node";
class Action extends Node{//abstract
  constructor(options){
    super(options);
    this.editor.parameters = [];
    this.editor.description="Generic Action";
    this.outputs[" "]=[];
  }
  async code(p,o){
    try{
      await window.robot[this.action]();
    }catch(e){
      console.log(e);
    }
    o(" ",p);
  }
  reset(){}
}
export class Charge extends Action{
  constructor(options){
    super(options);
    this.action = "charge";
    this.editor.description="Charges the robot.";
  }
}
export class Discharge extends Action{
  constructor(options){
    super(options);
    this.action = "discharge";
    this.editor.description="Discharges the robot.";
  }
}
