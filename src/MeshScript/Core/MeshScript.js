import IterableObject from '../../utils/IterableObject';
import Random from '../../utils/Random';
import {Link} from "./Link";
import {Node} from "./Node";
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
    for(const [id,n] of nodeDescriptors)this.addNode(n,id);
    //link creation from patern
    for(const [id,l] of linkDescriptors)this.addLink(l,id);
  }
  addNode(n,id = Random.string){
    if(typeof n == "string") n = JSON.parse(n);
    if(n.type && n.type in MeshScript.nodeConstructors){
      this.nodes[id]=new MeshScript.nodeConstructors[n.type](n);
      return id;
    }else{
      throw new Error(`Couldn't create Node: ${n.type} not in nodeConstructors`);
    }
    return id;
  }
  addLink(l,id = Random.string){
    if(typeof l == "string") l = JSON.parse(l);
    if(l.start && l.end && l.output){
      if(this.nodes[l.start]) l.start = this.nodes[l.start];
      if(this.nodes[l.end]) l.end = this.nodes[l.end];
      if( l.start instanceof Node &&  l.end instanceof Node){
        this.links[id]=new Link(l.start,l.output,l.end,l);
      }else{
        throw new Error(`Couldn't create Link: node(s) unknown`);
      }
    }else{
      throw new Error(`Couldn't create Link: parameter missing`);
    }
    return id;
  }
  removeNode(node){
    for(const [id,n] of this.nodes){
      if(node == n)delete this.nodes[id];
    }
    for(const [id,link] of this.links){
      if(link.start == node || link.end == node){
        delete this.links[id];
        link.disconnect();
      }
    }
  }
  removeLink(link){
    link.disconnect();
    for(const [id,l] of this.links){
      if(link == l)delete this.links[id];
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
