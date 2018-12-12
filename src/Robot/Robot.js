import { Point } from '../utils/Math2d';
import { toast } from 'react-toastify';
export default class Robot{
  constructor(field,start){
    this.field = field;
    this.start = new Point(start);
    this.speed = 500;
    this.reset();
  }
  reset(){
    this.position = this.start.clone();
    this.rotation = 0;
    this.charged = false;
    this.history = [];
    this.errors = [];
    for(const {x,y,type} of this.field){
      if(type.includes("source"))this.field.set(x,y,"source");
      if(type.includes("sink"))this.field.set(x,y,"sink");
    }
  }
  forward(){
    if(this.won)return;
    this.history.push("forward");
    const future = this.__getFuture();
    const inFront = this.inFrontOf();
    if(!inFront.includes("wall") && !inFront.includes("source") && !inFront.includes("sink")){
      this.position = future;
    }else{
      this.__error('Forward imposible');
    }
  }
  left(){
    if(this.won)return;
    this.rotation += 1;
    this.rotation %= 4;
    this.history.push("left");
  }
  right(){
    if(this.won)return;
    this.rotation += 3;
    this.rotation %= 4;
    this.history.push("Right");
  }
  charge(){
    if(this.won)return;
    this.history.push("charge");
    if(this.inFrontOf()=="source" && !this.charged){
      this.charged = true;
      this.field.set(...this.__getFuture(),"source-discharged");
      this.__success('↑ Charged successfully!');
    }else{
      this.__error('Can\'t charge here');
    }
  }
  discharge(){
    if(this.won)return;
    this.history.push("discharge");
    if(this.inFrontOf()=="sink" && this.charged){
      this.charged = false;
      this.field.set(...this.__getFuture(),"sink-charged");
      this.__success('↓ Discharged successfully!');
    }else{
      this.__error('Can\'t discharge here');
    }
  }
  render(ctx){
    ctx.save();
    ctx.filter ="blur(1px)";
    ctx.strokeStyle = "#7ed6df";
    ctx.translate(...this.position.multiply(100));
    ctx.translate(50,50);
    ctx.rotate(-Math.PI/2*this.rotation)
    ctx.translate(-50,-50);
    ctx.strokeRect(23,5,54,50);
    ctx.strokeRect(30,40,10,15);
    ctx.strokeRect(60,40,10,15);
    ctx.strokeRect(5,20,15,55);
    ctx.strokeRect(80,20,15,55);
    if(this.charged){
      ctx.strokeStyle = "#ffbe76";
      ctx.beginPath();
      ctx.arc(50,75,15,0,Math.PI*2);
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
