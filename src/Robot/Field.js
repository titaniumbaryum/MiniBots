import { Point } from '../utils/Math2d';
export default class Field{
  constructor(tiles){
    this.tiles = tiles;
    this[Symbol.iterator]=function*(){
      for(let y=0;y<this.height;y++){
        for(let x=0;x<this.width;x++){
          yield {x,y,type:this.tiles[y][x]};
        }
      }
    }
  }
  get(x,y){
    if(x<0)return "wall";
    if(y<0)return "wall";
    if(x>=this.width)return "wall";
    if(y>=this.height)return "wall";
    return this.tiles[y][x];
  }
  set(x,y,v){
    if(this.tiles[y] && typeof this.tiles[y][x]=="string"){
      this.tiles[y][x]=v;
    }
  }
  get width(){
    return this.tiles[0].length;
  }
  get height(){
    return this.tiles.length;
  }
  static renderTile(type,ctx){
    function fuzline(from,to,fuzes){
      const vector = to.minus(from);
      ctx.beginPath();
      ctx.moveTo(...from);
      for(let i=0;i<fuzes+1;i++){
        ctx.lineTo(
          ...from.plus(
            vector.multiply(i/fuzes).plus(
              new Point(0,i%2?1:-1*1).rotate(vector.angle)
            )
          )
        );
      }
      ctx.stroke();
    }
    ctx.filter ="blur(1px)";
    if(type == "source"){
      ctx.strokeStyle = "#ffbe76";
      ctx.strokeRect(3,3,94,94);
      ctx.strokeRect(13,13,74,74);
    }else if(type == "source-discharged"){
      ctx.strokeStyle = "#ffbe76";
      ctx.strokeRect(3,3,94,94);
    }else if(type == "sink"){
      ctx.strokeStyle = "#ffbe76";
      ctx.strokeRect(3,3,94,94);
    }else if(type == "sink-charged"){
      ctx.strokeStyle = "#ffbe76";
      ctx.strokeRect(3,3,94,94);
      ctx.strokeRect(13,13,74,74);
    }else if(type == "exit"){
      ctx.strokeStyle = "#7ed6df";
      ctx.strokeRect(3,3,94,94);
    }else if(type.includes("wall")){
      const fuzes = 32;
      ctx.strokeStyle = "#ff7979";
      if(type.includes("N")){
        fuzline(new Point(3,3),new Point(94,3),fuzes);
      }
      if(type.includes("S")){
        fuzline(new Point(3,94),new Point(94,94),fuzes);
      }
      if(type.includes("W")){
        fuzline(new Point(3,3),new Point(3,94),fuzes);
      }
      if(type.includes("E")){
        fuzline(new Point(94,3),new Point(94,94),fuzes);
      }
    }
  }
}
