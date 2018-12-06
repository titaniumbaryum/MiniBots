import { Point } from '../utils/Math2d';
export default class Field{
  constructor(tiles){
    this.tiles = tiles;
  }
  get width(){
    return tiles[0].length;
  }
  get height(){
    return tiles.length;
  }
  static renderTile(type,ctx){
    function fuzline(from,to,fuzes){
      const vector = to.minus(from);
      ctx.beginPath();
      ctx.moveTo(...from);
      for(const i=0;i<fuzes,i++){
        ctx.lineTo(from.plus(vector.multiply(i/fuzes).plus(new Point(0,(Math.random-.5)*8)).rotate(vector.angle))))
      }
    }
    if(type = "source"){
      ctx.strokeStyle = "#ffbe76";
      ctx.strokeRect(3,3,94,94);
    }else if(type = "sink"){
      ctx.strokeStyle = "#ffbe76";
      ctx.strokeRect(3,3,94,94);
    }else if(type = "exit"){
      ctx.strokeStyle = "#7ed6df";
      ctx.strokeRect(3,3,94,94);
    }else if(type = "wall"){
      if("N" in type){

      }
    }
  }
}
