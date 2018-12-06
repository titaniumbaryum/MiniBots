class ColorCycler{
  constructor(){
    this.index=0;
  }
  get last(){
    return ColorCycler.colors[this.index];
  }
  get(){
    this.index++;
    this.index%=ColorCycler.colors.length;
    return this.last;
  }
  static random(){
    return ColorCycler.colors[Math.floor(Math.random()*ColorCycler.colors.length)];
  }
  static get(i){
    return ColorCycler.colors[i];
  }
}
ColorCycler.colors = ['#f9ca24','#f0932b','#eb4d4b','#6ab04c','#22a6b3','#be2edd'];
//ColorCycler.colors = ['red','green','blue','yellow','cyan','orange'];
export default ColorCycler;
