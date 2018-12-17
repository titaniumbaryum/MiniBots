export default class Random{
  static get float(){
    return Math.random();
  }
  static get percent(){
    return this.float*100;
  }
  static get int(){
    return Math.rond(this.percent);
  }
  static get bool(){
    return Math.round(this.float)
  }
  static get string(){
    return this.float.toString(36).substring(2, 15) + this.float.toString(36).substring(2, 15);
  }
  static fromTo(from,to){
    return Math.round(from+this.float*(to-from));
  }
  static inArray(arr){
    return arr[this.fromTo(0,arr.length-1)];
  }
  static shuffle(arr){
    return arr.sort((a,b)=>this.bool*2-1);
  }
  static *fakeRandomGenerator(arr){
    while(true){
      arr = this.shuffle(arr);
      for(const v of arr){
        yield v;
      }
    }
  }
  static *randomGenerator(arr){
    yield this.inArray(arr);
  }
}
