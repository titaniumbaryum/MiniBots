import { Point } from './Math2d';
class ToolEvent extends CustomEvent{
  constructor(type,point,delta,holding){
    super(type);
    this.point = point;
    this.delta = delta;
    this.holding = holding;
  }
}
export default class Tool extends EventTarget{
  constructor(c){
    super();
    function toCanvasCoordinates(evt,c){
      const rect = c.getBoundingClientRect();
      const matrix = c.getContext("2d").getTransform().invertSelf();
      return new Point(
        (evt.clientX - rect.left) * matrix.a + (evt.clientY - rect.top) * matrix.c + matrix.e,
        (evt.clientX - rect.left) * matrix.b + (evt.clientY - rect.top) * matrix.d + matrix.f
      );
    }
    function toCanvasCoordinatesVector(p,c){
      const rect = c.getBoundingClientRect();
      const matrix = c.getContext("2d").getTransform().invertSelf();
      return new Point(
        (p.x) * matrix.a + (p.y) * matrix.c,
        (p.y) * matrix.b + (p.y) * matrix.d
      );
    }
    //resize
    let running = false;
    window.addEventListener("resize", ()=>{
      if (running) { return; }
      running = true;
      requestAnimationFrame(()=>{
        this.dispatchEvent(new CustomEvent("resize"));
        running = false;
      });
    });
    //tool (mouse)
    c.addEventListener("mousedown",e=>{
      const p = toCanvasCoordinates(e,c);
      const te = new ToolEvent("down",p);
      this.__prevEvent = te;
      this.__prevMouseEvent = e;
      if(e.buttons==1)this.dispatchEvent(te);
    });
    c.addEventListener("mouseup",e=>{
      const p = toCanvasCoordinates(e,c);
      const te = new ToolEvent("up",p);
      this.__prevEvent = te;
      this.__prevMouseEvent = e;
      if(e.button==0)this.dispatchEvent(te);
    });
    c.addEventListener("mousemove",e=>{
      if(!this.__prevMouseEvent)return;
      const p = toCanvasCoordinates(e,c);
      const d = toCanvasCoordinatesVector(new Point(e.clientX,e.clientY).minus([this.__prevMouseEvent.clientX,this.__prevMouseEvent.clientY]),c);
      this.__prevMouseEvent = e;
      if(e.buttons==1){
        const tde = new ToolEvent("drag",p,d);
        this.dispatchEvent(tde);
        this.__prevEvent = tde;
      }
      if(e.buttons==4){
        const tme = new ToolEvent("move",p,d);
        this.dispatchEvent(tme);
        this.__prevEvent = tme;
      }
    });
    c.addEventListener("wheel",e=>{
      const p = toCanvasCoordinates(e,c);
      const te = new ToolEvent("zoom",p,Math.sign(e.deltaY));
      this.__prevEvent = te;
      this.__prevMouseEvent = e;
      this.dispatchEvent(te);
      e.preventDefault();
      return false;
    });
    c.addEventListener("contextmenu",e=>{
      const p = toCanvasCoordinates(e,c);
      const te = new ToolEvent("menu",p);
      this.__prevEvent = te;
      this.__prevMouseEvent = e;
      this.dispatchEvent(te);
      e.preventDefault();
      return false;
    });
    c.addEventListener("dragover",e=>e.preventDefault());
    c.addEventListener("drop",e=>{
      e.preventDefault();
      const p = toCanvasCoordinates(e,c);
      const te = new ToolEvent("dropin",p,null,e.dataTransfer.items);
      this.dispatchEvent(te);
    });
  }
  on(type,fun){this.addEventListener(type,fun);}
}
