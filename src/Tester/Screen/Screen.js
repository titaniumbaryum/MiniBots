import React, { Component } from 'react';
import './Screen.css';
import Field from '../../Robot/Field';

class Screen extends Component {
  constructor(props){
    super(props);
    this.prevHash = 0;
  }
  render(){
    return (
      <div className="field-box" ref={c => this.sizer = c}>
        <canvas ref={c => this.c = c}></canvas>
      </div>
    );
  }
  componentDidMount(){
    this.componentDidUpdate();
  }
  __hashField(){//return a hash of the field
    function hashCode(s){
      return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    }
    return hashCode(this.props.field.tiles.join(","));
  }
  __drawField(){//draw field in an image to be displayed faster
    const c = document.createElement("CANVAS");
    c.width = this.props.field.width*100;
    c.height = this.props.field.height*100;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "rgb(80,80,80)";//draw grid
    for(let i=0;i<this.props.field.width+1;i++){
      ctx.fillRect(i*100-.5,0,1,this.props.field.height*100);
    }
    for(let i=0;i<this.props.field.height+1;i++){
      ctx.fillRect(0,i*100-.5,this.props.field.width*100,1);
    }

    for(const {x,y,type} of this.props.field){//draw tiles
      ctx.save();
      ctx.translate(x*100,y*100);
      Field.renderTile(type,ctx);
      ctx.restore();
    }
    this.fieldImage = new Image();
    this.fieldImage.src = c.toDataURL();
  }
  componentDidUpdate(){
    this.ctx = this.c.getContext("2d");
    this.update();
  }
  update(){//draw the whole frame
    const minWidth = 10;//parameters
    const minHeight = 5;

    if(!this.props.field||!this.sizer||!this.c) return;

    const width = Math.max(this.props.field.width,minWidth);//limiting the zoom
    const height = Math.max(this.props.field.height,minHeight);

    this.c.width = this.sizer.clientWidth;//responsive
    this.c.height = this.sizer.clientWidth/width*height;//fixed aspect ratio
    this.ctx.resetTransform();

    this.ctx.translate(this.c.width/2,this.c.height/2);//centering part 1

    const resizeRatio = this.c.width/100/width;//rescale
    this.ctx.scale(resizeRatio,resizeRatio);

    this.ctx.translate(-this.props.field.width*100/2,-this.props.field.height*100/2);//centering part 2

    const h = this.__hashField();
    if(this.prevHash != h){//if hash changed then field has changed
      this.prevHash = h;
      this.drawField();//redraw field
    }
    this.ctx.drawImage(this.fieldImage,0,0);//paste field

    this.props.robot.render(this.ctx);//draw robot
  }
}
export default Screen;
