export default class IterableObject{
  constructor(a){
    if(a){
      for(const i of Object.keys(a)){
        this[i] = a[i];
      }
    }
    this[Symbol.iterator]=function*(){
      for(const i of Object.keys(this)){
        yield [i,this[i]];
      }
    }
  }
  get length(){
    return Object.keys(this).length;
  }
}
