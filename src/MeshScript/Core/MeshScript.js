import IterableObject from '../../utils/IterableObject';
import {Link} from "./Link";
import {Node} from "./Node";
export class MeshScript{
  constructor(descriptor = {}){
    const nodeDescriptors = new IterableObject(descriptor.nodes||{});
    const linkDescriptors = new IterableObject(descriptor.links||{});
    this.nodes=new IterableObject();
    this.links=new IterableObject();
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
    for(var i in this.links){
      this.links[i].disconnect();
      delete this.links[i];
    }
    for(var i in this.nodes){
      delete this.nodes[i];
    }
  }
  pause(){
    for(var i in this.links){
      this.links[i].pause();
    }
  }
  unpause(){
    for(var i in this.links){
      this.links[i].unpause();
    }
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
MeshScript.nodeConstructors=new IterableObject({Node:Node});
function isSet(i){
  return typeof i !== "undefined";
}
