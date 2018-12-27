import { Point } from './Math2d';
//Canvas Mouse Tool
class ToolEvent extends CustomEvent{
  constructor(type,point,delta,holding){
    super(type);
    this.point = point;
    this.delta = delta;
    this.holding = holding;
  }
}
export default class Tool extends EventTarget{
  constructor(c){//takes HTMLCanvas
    super();
    function toCanvasCoordinates(evt,c){
      const p = new Point();
      if(evt instanceof TouchEvent){p.x=evt.changedTouches[0].clientX;p.y=evt.changedTouches[0].clientY;}
      else{p.x=evt.clientX;p.y=evt.clientY;}
      const rect = c.getBoundingClientRect();
      const matrix = c.getContext("2d").getTransform().invertSelf();
      return new Point(
        (p.x - rect.left) * matrix.a + (p.y - rect.top) * matrix.c + matrix.e,
        (p.x - rect.left) * matrix.b + (p.y - rect.top) * matrix.d + matrix.f
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
    const mousedown = e=>{
      const p = toCanvasCoordinates(e,c);
      const te = new ToolEvent("down",p);
      this.__prevEvent = te;
      this.__prevMouseEvent = e;
      if((e instanceof TouchEvent && e.touches.length<2) || e.buttons==1)this.dispatchEvent(te);
    }
    c.addEventListener("mousedown",mousedown);
    c.addEventListener("touchstart",mousedown);

    const mouseup = e=>{
      const p = toCanvasCoordinates(e,c);
      const te = new ToolEvent("up",p);
      this.__prevEvent = te;
      this.__prevMouseEvent = e;
      if(e instanceof TouchEvent || e.button==0)this.dispatchEvent(te);
    }
    c.addEventListener("mouseup",mouseup);
    c.addEventListener("touchend",mouseup);

    const movecommon = e=>{
      const p = toCanvasCoordinates(e,c);
      let dp;
      if(e instanceof TouchEvent){
        dp = new Point(e.touches[0].clientX,e.touches[0].clientY).minus([this.__prevMouseEvent.touches[0].clientX,this.__prevMouseEvent.touches[0].clientY])
      }else{
        dp = new Point(e.clientX,e.clientY).minus([this.__prevMouseEvent.clientX,this.__prevMouseEvent.clientY])
      }
      const d = toCanvasCoordinatesVector(dp,c);
      this.__prevMouseEvent = e;
      return {p,d}
    };
    const mousemove = e=>{
      if(!this.__prevMouseEvent)return;
      const {p,d} = movecommon(e);
      if(e.buttons==1){
        const tde = new ToolEvent("drag",p,d);
        this.dispatchEvent(tde);
        this.__prevEvent = tde;
      }else if(e.buttons==4){
        const tme = new ToolEvent("move",p,d);
        this.dispatchEvent(tme);
        this.__prevEvent = tme;
      }
    };
    const touchmove = e=>{
      if(!this.__prevMouseEvent)return;
      const {p,d} = movecommon(e);
      if(e.touches.length==1){
        const tde = new ToolEvent("drag",p,d);
        this.dispatchEvent(tde);
        this.__prevEvent = tde;
      }else if(e.touches.length==2){
        const distance = new Point(e.touches[1].clientX,e.touches[1].clientY).minus([e.touches[0].clientX,e.touches[0].clientY]).length;
        const prevDistance = new Point(this.__prevMouseEvent.touches[1].clientX,this.__prevMouseEvent.touches[1].clientY).minus([this.__prevMouseEvent.touches[0].clientX,this.__prevMouseEvent.touches[0].clientY]).length;
        const distanceDelta = distance - prevDistance;
        const centerEvent = {
          clientX:e.touches[0].clientX+e.touches[1].clientX,
          clientY:e.touches[0].clientY+e.touches[1].clientY
        };
        const prevCenterEvent = {
          clientX:this.__prevMouseEvent.touches[0].clientX+this.__prevMouseEvent.touches[1].clientX,
          clientY:this.__prevMouseEvent.touches[0].clientY+this.__prevMouseEvent.touches[1].clientY
        };
        const cp = toCanvasCoordinates(centerEvent,c);
        const cd = toCanvasCoordinatesVector(new Point(centerEvent.clientX,centerEvent.clientY).minus([prevCenterEvent.clientX,prevCenterEvent.clientY]),c);
        const tme = new ToolEvent("move",cp,cd);
        const tze = new ToolEvent("zoom",cp,distanceDelta);
        this.dispatchEvent(tme);
        this.dispatchEvent(tze);
        this.__prevEvent = tme;
        e.preventDefault();
      }
    };
    c.addEventListener("mousemove",mousemove);
    c.addEventListener("touchmove",touchmove);

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
    c.addEventListener("mouseleave",e=>{
      const p = toCanvasCoordinates(e,c);
      const te = new ToolEvent("leave",p);
      this.__prevEvent = te;
      this.__prevMouseEvent = e;
      this.dispatchEvent(te);
      e.preventDefault();
      return false;
    });
    c.addEventListener("drop",e=>{
      e.preventDefault();
      const p = toCanvasCoordinates(e,c);
      const te = new ToolEvent("dropin",p,null,e.dataTransfer.items);
      this.dispatchEvent(te);
    });
  }
  on(type,fun){this.addEventListener(type,fun);}
  trigger(type,e){this.dispatchEvent(new ToolEvent(type,e.point,e.delta,e.holding))}
}
