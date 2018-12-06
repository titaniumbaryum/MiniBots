import { Point } from './Math2d';
class ToolEvent extends CustomEvent{
  constructor(type,point,delta){
    super(type);
    this.point = point;
    this.delta = delta;
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
      this.__prevMouseEvent = te;
      if(e.buttons==1)this.dispatchEvent(te);
    });
    c.addEventListener("mouseup",e=>{
      const p = toCanvasCoordinates(e,c);
      const te = new ToolEvent("up",p);
      this.__prevMouseEvent = te;
      if(e.button==0)this.dispatchEvent(te);
    });
    c.addEventListener("mousemove",e=>{
      if(!this.__prevMouseEvent)return;
      const p = toCanvasCoordinates(e,c);
      const tde = new ToolEvent("drag",p,p.minus(this.__prevMouseEvent.point));
      const tme = new ToolEvent("move",p,p.minus(this.__prevMouseEvent.point));
      this.__prevMouseEvent = tde;
      if(e.buttons==1)this.dispatchEvent(tde);
      if(e.buttons==4)this.dispatchEvent(tme);
    });
    c.addEventListener("wheel",e=>{
      const p = toCanvasCoordinates(e,c);
      const te = new ToolEvent("zoom",p,Math.sign(e.deltaY));
      this.__prevMouseEvent = te;
      this.dispatchEvent(te);
      e.preventDefault();
      return false;
    });
    c.addEventListener("contextmenu",e=>{
      const p = toCanvasCoordinates(e,c);
      const te = new ToolEvent("menu",p);
      this.__prevMouseEvent = te;
      this.dispatchEvent(te);
      e.preventDefault();
      return false;
    });
  }
  on(type,fun){this.addEventListener(type,fun);}
}
