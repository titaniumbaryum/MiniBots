import { Point } from '../utils/Math2d';
import { toast } from 'react-toastify';
export default class Robot{
  constructor(field,start){
    this.field = field;
    this.start = new Point(start);
    this.speed = 1.5;
    this.__actions = {
      "conditions":{
        "none":()=>true,
        "left":()=>true,
        "right":()=>true,
        "forward":()=>!this.inFrontOf().includes("wall") && !this.inFrontOf().includes("source") && !this.inFrontOf().includes("sink"),
        "charge":()=>(this.inFrontOf()=="source" && !this.charged),
        "discharge":()=>(this.inFrontOf()=="sink" && this.charged),
      },
      "successes":{
        "left":()=>{
          this.rotation += 1;
          this.rotation %= 4;
        },
        "right":()=>{
          this.rotation += 3;
          this.rotation %= 4;
        },
        "forward":()=>{
          this.position = this.__getFuture();
        },
        "charge":()=>{
          this.charged = true;
          this.field.set(...this.__getFuture(),"source-discharged");
          this.__success('↑ Charged successfully!');
        },
        "discharge":()=>{
          this.charged = false;
          this.field.set(...this.__getFuture(),"sink-charged");
          this.__success('↓ Discharged successfully!');
        },
      },
      "errors":{
        "forward":()=>this.__error('Forward imposible'),
        "charge":()=>this.__error('Can\'t charge here'),
        "discharge":()=>this.__error('Can\'t discharge here'),
      }
    };
    this.reset();
  }
  reset(){
    this.position = this.start.clone();
    this.rotation = 0;
    this.charged = false;
    this.history = [];
    this.errors = [];
    if(this.stack) for(const a of this.stack) a.reject(new Error("reset"));
    this.stack = [];
    for(const {x,y,type} of this.field){
      if(type.includes("source"))this.field.set(x,y,"source");
      if(type.includes("sink"))this.field.set(x,y,"sink");
    }
  }
  forward(){
    if(this.won)return new Promise((res,rej)=>{});
    return this.pushAction("forward");
  }
  left(){
    if(this.won)return new Promise((res,rej)=>{});
    return this.pushAction("left");
  }
  right(){
    if(this.won)return new Promise((res,rej)=>{});
    return this.pushAction("right");
  }
  charge(){
    if(this.won)return new Promise((res,rej)=>{});
    return this.pushAction("charge");
  }
  discharge(){
    if(this.won)return new Promise((res,rej)=>{});
    return this.pushAction("discharge");
  }
  update(){
    if(this.won)return;
    if(this.currentAction.type === "none") return;
    if(this.currentAction.steps==0 && !this.__actions.conditions[this.currentAction.type]()){
      this.__actions.errors[this.currentAction.type]();
      this.currentAction.reject(new Error("condition"));
      this.history.push(this.stack.shift().type);
      return;
    }
    this.currentAction.steps += this.speed;
    if(this.currentAction.steps>=100){
      this.__actions.successes[this.currentAction.type]();
      this.currentAction.resolve();
      this.history.push(this.stack.shift().type);
    }
  }
  render(ctx){
    ctx.save();
    ctx.filter ="blur(1px)";
    ctx.strokeStyle = "#7ed6df";
    ctx.translate(...this.position.multiply(100));
    if(this.currentAction.type=="forward"){
      const vector = this.__getFuture().minus(this.position).multiply(this.currentAction.steps);
      ctx.translate(...vector);
    }
    ctx.translate(50,50);
    ctx.rotate(-Math.PI/2*this.rotation)
    if(this.currentAction.type=="left"){
      ctx.rotate(-this.currentAction.steps/100*Math.PI/2);
    }
    if(this.currentAction.type=="right"){
      ctx.rotate(this.currentAction.steps/100*Math.PI/2);
    }
    ctx.translate(-50,-50);
    ctx.strokeRect(23,5,54,50);
    ctx.strokeRect(30,40,10,15);
    ctx.strokeRect(60,40,10,15);
    ctx.strokeRect(5,20,15,55);
    ctx.strokeRect(80,20,15,55);
    let cs = 1;
    if(this.currentAction.type=="charge"){
      cs = this.currentAction.steps/100;
    }
    if(this.currentAction.type=="discharge"){
      cs = 1-this.currentAction.steps/100;
    }
    if(this.charged||this.currentAction.type=="charge"||this.currentAction.type=="discharge"){
      ctx.strokeStyle = "#ffbe76";
      ctx.beginPath();
      ctx.arc(50,75,15*cs,0,Math.PI*2);
      ctx.stroke();
    }
    ctx.restore();
  }
  __getFuture(){
    const delta = new Point();
    if(this.rotation==0){delta.x=0;delta.y=1;}
    if(this.rotation==1){delta.x=1;delta.y=0;}
    if(this.rotation==2){delta.x=0;delta.y=-1;}
    if(this.rotation==3){delta.x=-1;delta.y=0;}
    return this.position.plus(delta);
  }
  __error(e){
    this.errors.push(e);
    toast.error(e, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      closeButton: false
    });
  }
  __success(s){
    toast.success(s, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      closeButton: false
    });
  }
  pushAction(type){
    return new Promise((resolve,reject)=>{
      this.stack.push({type,resolve,reject,steps:0});
    });
  }
  get currentAction(){
    if(this.stack.length){
      return this.stack[0];
    }else{
      return {type:"none"}
    }
  }
  get won(){
    for(const {x,y,type} of this.field){
      if(type=="sink")return false;
    }
    return this.field.get(...this.position)==="exit";
  }
  inFrontOf(){
    return this.field.get(...this.__getFuture());
  }
}
