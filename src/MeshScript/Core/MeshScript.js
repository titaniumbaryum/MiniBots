import IterableObject from '../../utils/IterableObject';
import {Link} from "./Link";
export class MeshScript{
  constructor(descriptor = {}){
    this.nodes=new IterableObject();
    this.links=new IterableObject();
    this.set(descriptor);
  }
  set(descriptor={}){
    this.destroy();
    const nodeDescriptors = new IterableObject(descriptor.nodes||{});
    const linkDescriptors = new IterableObject(descriptor.links||{});
    //node creation from patern
    for(const [id,n] of nodeDescriptors){
      if(n.type && n.type in MeshScript.nodeConstructors){
        this.nodes[id]=new MeshScript.nodeConstructors[n.type](n);
      }
    }
    //link creation from patern
    for(const [id,l] of linkDescriptors){
      if(l.start && l.end && l.output){
        this.links[id]=new Link(this.nodes[l.start],l.output,this.nodes[l.end],l);
      }
    }
  }
  destroy(){
    for(const [i,v] of this.links){
      v.disconnect();
      delete this.links[i];
    }
    for(const [i,v] of this.nodes){
      delete this.nodes[i];
    }
  }
  pause(){
    for(let [id,link] of this.links)link.pause();
  }
  unpause(){
    for(let [id,link] of this.links)link.unpause();
  }
  reset(){
    for(let [id,object] of [...this.nodes,...this.links])object.reset();
  }
  toString(){
    const nodeDescriptors = {};
    for(let [i,n] of this.nodes){
      nodeDescriptors[i] = n.toJSONable();
    }
    const linkDescriptors = {};
    for(let [i,l] of this.links){
      linkDescriptors[i] = l.toJSONable(this);
    }
    let m ={
      nodes:nodeDescriptors,
      links:linkDescriptors,
    };
    return JSON.stringify(m);
  }
  static registerNodeConstructor(n){
    MeshScript.nodeConstructors[n.name] = n;
  }
}
MeshScript.nodeConstructors=new IterableObject();
function isSet(i){
  return typeof i !== "undefined";
}
