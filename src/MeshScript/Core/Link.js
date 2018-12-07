import { Point } from '../../utils/Math2d';
export class Link{
  constructor(i,n,o,options){
    this.id=Math.round(Math.random()*1000000);//unique identifier
    this.start=i;//start node
    this.end=o;//end node
    this.output=n;//start node output name
    this.p=false;//pause
    this.s=false;//store activation if paused
    this.sp={};//store the parameters of the last stored activation
    this.d=this.start.connect(this.output,this);//start node output connection token
    this.options = options||{};
  }
  render(ctx){
    const start = this.start.getOutputPosition(this.output);
    const end = this.end.getPosition();
    const angle = end.minus(start).angle;
    const length = end.minus(start).length;
    const elasticity = 500;
    const radius = 10;
    const baseWidth = 10;
    const width = (2*radius-baseWidth)*Math.exp(-2*Math.pow(length/elasticity,2))+baseWidth;
    const h = radius*4/3*Math.tan(Math.PI/8);
    const rend = start.plus(new Point(length,0));
    const debugCurve=(a,b,c,d,e,f)=>{
      ctx.beginPath();
      ctx.arc(e,f,2,0,2*Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(a,b,1,0,2*Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(c,d,1,0,2*Math.PI);
      ctx.fill();
    };
    //const curve = debugCurve;
    const curve = ctx.bezierCurveTo.bind(ctx);
    ctx.save();
    ctx.fillStyle = this.options.editor.color;
    ctx.globalAlpha = 0.1;
    ctx.translate(...start);
    ctx.rotate(angle);
    ctx.translate(...start.multiply(-1));
    ctx.beginPath();
    ctx.moveTo(...start.minus(new Point(0,radius)));
    curve(...start.minus(new Point(0,radius)).minus(new Point(h,0)),...start.minus(new Point(radius,0)).minus(new Point(0,h)),...start.minus(new Point(radius,0)));//circle 1 p1
    curve(...start.minus(new Point(radius,0)).plus(new Point(0,h)),...start.plus(new Point(0,radius)).minus(new Point(h,0)),...start.plus(new Point(0,radius)));//circle 1 p2
    //curve(...start.plus(new Point(radius,width/2)),...rend.minus(new Point(radius,-width/2)),...rend.plus(new Point(0,radius)));//bridge 1 old
    curve(...start.plus(new Point(radius,radius)),...start.plus(new Point(radius,width/2)),...start.plus(new Point(radius*2,width/2)));//bridge 1 p1
    ctx.lineTo(...rend.plus(new Point(-radius*2,width/2)));
    curve(...rend.plus(new Point(-radius,width/2)),...rend.plus(new Point(-radius,radius)),...rend.plus(new Point(0,radius)));//bridge 1 p2
    curve(...rend.plus(new Point(0,radius)).plus(new Point(h,0)),...rend.plus(new Point(radius,0)).plus(new Point(0,h)),...rend.plus(new Point(radius,0)));//circle 2 p1
    curve(...rend.plus(new Point(radius,0)).minus(new Point(0,h)),...rend.minus(new Point(0,radius)).plus(new Point(h,0)),...rend.minus(new Point(0,radius)));//circle 2 p2
    //curve(...rend.minus(new Point(radius,width/2)),...start.plus(new Point(radius,-width/2)),...start.minus(new Point(0,radius)));//bridge 2 old
    curve(...rend.minus(new Point(radius,radius)),...rend.minus(new Point(radius,width/2)),...rend.minus(new Point(radius*2,width/2)));//bridge 2 p1
    ctx.lineTo(...start.minus(new Point(-radius*2,width/2)));
    curve(...start.minus(new Point(-radius,width/2)),...start.minus(new Point(-radius,radius)),...start.minus(new Point(0,radius)));//bridge 2 p1
    ctx.fill();
    ctx.restore();
  }
  trigger(params){
    params.linkId=this.id;
    if(!this.p)this.end.trigger(params);//trigger end node
    else{//store the activation to be released at unpause
      this.s=true;
      this.sp=params;
    }
  }
  disconnect(){
    this.start.disconnect(this.d);
    delete this.start;
    delete this.end;
    delete this.output;
  }
  get playing(){
    return this.pause;
  }
  set playing(p){
    if(!p)this.pause();
    else this.unpause();
  }
  pause(){
    this.p=true;
  }
  unpause(){
    if(this.p && this.s){
      this.s=false;
      this.trigger(this.sp);
    }
    this.p=false;
  }
  reset(){
    this.s = false;
  }
  toJSONable(mesh){
    const o = {};
    for(const i of Object.keys(this.options)){
      o[i]=this.options[i];
    }
    o.output = this.output;
    for(const [i,n] of mesh.nodes){
      if(n == this.start) o.start = i;
      if(n == this.end) o.end = i;
    }
    return o;
  }
}
