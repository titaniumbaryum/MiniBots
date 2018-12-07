import { Point } from '../utils/Math2d';
export default class Robot{
  constructor(field,start){
    this.field = field;
    this.position = new Point(start);
    this.start = new Point(start);
    this.rotation = 0;
    this.charged = false;
  }
  reset(){
    this.position = this.start.clone();
    this.rotation = 0;
  }
  forward(){
    const future = this.__getFuture();
    if((!this.field.get(...future).includes("wall")) && this.field.get(...future)!="source" && this.field.get(...future)!="sink"){
      this.position = future;
    }
  }
  left(){
    this.rotation += 1;
    this.rotation %= 4;
  }
  right(){
    this.rotation += 3;
    this.rotation %= 4;
  }
  charge(){
    if(this.field.get(...this.__getFuture())=="source")this.charged = true;
  }
  discharge(){
    if(this.field.get(...this.__getFuture())=="sink")this.charged = false;
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
  inFrontOf(){
    return this.field.get(...this.__getFuture());
  }
}
