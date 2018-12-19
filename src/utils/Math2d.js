export class Point{
  constructor(...args){//new Point(point)||new Point({x,y})||new Point([x,y])||new Point(x,y)||new Point(n)||new Point()
    if(args[0] && args[0] instanceof Point){
      this.x=args[0].x;
      this.y=args[0].y;
    }else if(args[0] && args[0].hasOwnProperty('x') && args[0].hasOwnProperty('y')){
      this.x=parseFloat(args[0].x);
      this.y=parseFloat(args[0].y);
    }else if(args[0] instanceof Array){
      this.x = parseFloat(args[0][0]);
      this.y = parseFloat(args[0][1]);
    }else if(typeof args[0] != "undefined" && typeof args[1] == "undefined"){
      this.x = parseFloat(args[0]);
      this.y = parseFloat(args[0]);
    }else if(typeof args[0] != "undefined"){
      this.x = parseFloat(args[0]);
      this.y = parseFloat(args[1]);
    }else{
      this.x = 0;
      this.y = 0;
    }
    const that=this;
    this[Symbol.iterator]=function*(){
      yield that[0];
      yield that[1];
    }
  }
  static fromPolar(a,l){
    const p = new Point(0,l);
    p.angle = a;
    return p;
  }
  toJSON(){
    return JSON.stringify([...this]);
  }
  get x(){
    return this[0];
  }
  set x(x){
    this[0] = parseFloat(x);
  }
  get y(){
    return this[1];
  }
  set y(y){
    this[1] = parseFloat(y);
  }
  get angle(){
    return Math.atan2(this.y,this.x);
  }
  set angle(a){
    const l = this.length;
    this.x = Math.cos(a)*l;
    this.y = Math.sin(a)*l;
  }
  get length(){
    return Math.sqrt(this.x*this.x+this.y*this.y);
  }
  set length(l){
    const a = this.angle;
    this.x = Math.cos(a)*l;
    this.y = Math.sin(a)*l;
  }
  clone(){//clone()
    return new Point(this);
  }
  plus(p){//plus(n)||plus(p)
    p = new Point(p);
    return new Point(this.x+p.x,this.y+p.y);
  }
  minus(p){//minus(n)||minus(p)
    p = new Point(p);
    return new Point(this.x-p.x,this.y-p.y);
  }
  multiply(p){//multiply(n)||multiply(p)
    p = new Point(p);
    return new Point(this.x*p.x,this.y*p.y);
  }
  divide(n){//divide(n)
    return new Point(this.x*n,this.y*n);
  }
  rotate(a,p){//rotate(a,[p])
    if(typeof p == "undefined"){
      p = this.clone();
      p.angle+=a;
      return p;
    }else{
      return this.minus(p).rotate(a).plus(p);
    }
  }
}

export default {};
