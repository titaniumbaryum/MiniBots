import { Point } from '../../utils/Math2d';
import IterableObject from '../../utils/IterableObject';

export class Node {
  constructor(options){
    this.editor={
      parameters:[
        {type:"list",key:"outputs",name:"Outputs (separated by ,)"},
        {type:"textarea",key:"code",name:"Code"}
      ],
      description:"the basic node, can only be used by developers"
    };
    this.options=typeof options !== "undefined"?options:{};
    this.outputs = new IterableObject();
    this.canConnect = true;
    this.update();
  }
  reset(){}
  update(){
    if(this.options.outputs){
      for(let id of this.options.outputs){
        this.outputs[id] = this.outputs[id]||[];
      }
      for(let [id,list] of this.outputs){
        if(this.options.outputs.indexOf(id)==-1) delete this.outputs[id];
      }
    }
  }
  getPosition(){
    return new Point(this.options.editor.point);
  }
  setPosition(x,y){
    this.options.editor.point = [x,y];
  }
  getOutputPosition(o){
    const i = Object.keys(this.outputs).indexOf(o);
    const l = Object.keys(this.outputs).length;
    if(i==-1)return;
    return Point.fromPolar(2*Math.PI*i/l-Math.PI/2-Math.PI/l,50).plus(this.getPosition());
  }
  render(ctx){
    ctx.save();
    ctx.textAlign = "center";
    ctx.strokeStyle = this.options.editor.color;
    ctx.fillStyle = this.options.editor.color;
    this.__renderMainBody(ctx);
    ctx.fillText(this.options.editor.name,...this.getPosition().plus([0,-55]));
    for(const [o,oo] of this.outputs){
      ctx.beginPath();
      ctx.arc(...this.getOutputPosition(o),15,0,2*Math.PI);
      ctx.stroke();
      ctx.fillText(o,...this.getOutputPosition(o).plus([0,25]));
    }
    ctx.restore();
  }
  __renderMainBody(ctx){
    ctx.beginPath();
    ctx.arc(...this.getPosition(),50,0,2*Math.PI);
    ctx.stroke();
  }
  connect(output,link){
    if(output in this.outputs){
      var id=Math.round(Math.random()*1000000); //create connection token
      this.outputs[output].push({id:id,link:link});
      return id;
    }else return false;
  }
  disconnect(id){
    for(var output in this.outputs){
      for(var i=0;i<this.outputs[output].length;i++){
        if(this.outputs[output][i].id == id)this.outputs[output].splice(i,1);
      }
    }
  }
  log(){
    console.log(this.options);
    console.log(this.outputs);
  }
  trigger(params){
    var outputs=this.outputs;
    try{this.code(params,
      function(output,params){//output trigger function
        if(output in outputs){
          for(var i=0;i<outputs[output].length;i++){
            outputs[output][i].link.trigger(params);
          }
        }
      }
    );}catch(e){console.log(e);}
  }
  get code(){
    return eval(this.options.code)||function(p,o){};
  }
  toString(){

    return JSON.stringify(this.toJSONable());
  }
  toJSONable(){
    const o = {};
    for(const i of Object.keys(this.options)){
      o[i]=this.options[i];
    }
    o.type = this.constructor.name;
    if(typeof o.code == "function") o.code = o.code.toString();
    return o;
  }
  static render(ctx,color){
    const n = new this({editor:{point:[0,0],name:this.name,color}});
    n.render(ctx);
  }
}
