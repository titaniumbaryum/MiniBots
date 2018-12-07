import React, { Component } from 'react';
import './Screen.css';
import Field from '../Robot/Field';

class Screen extends Component {
  constructor(props){
    super(props);
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
    setInterval(()=>{
      this.update();
    },1000/60);
  }
  componentDidUpdate(){
    this.ctx = this.c.getContext("2d");
  }
  componentWillUnmount(){

  }
  update(){
    const minWidth = 10;//parameters
    const minHeight = 5;

    if(!this.props.field||!this.sizer||!this.c) return;

    const width = Math.max(this.props.field.width,minWidth);//limiting the zoom
    const height = Math.max(this.props.field.height,minHeight);

    this.c.width = this.sizer.clientWidth;//responsive
    this.c.height = this.sizer.clientWidth/width*height;//fixed aspect ratio
    this.ctx.resetTransform();

    this.ctx.fillStyle = "rgb(50,50,50)";//black bg
    this.ctx.fillRect(0,0,this.c.width,this.c.height);

    this.ctx.translate(this.c.width/2,this.c.height/2);//centering part 1

    const resizeRatio = this.c.width/100/width;//rescale
    this.ctx.scale(resizeRatio,resizeRatio);

    this.ctx.translate(-this.props.field.width*100/2,-this.props.field.height*100/2);//centering part 2

    this.ctx.fillStyle = "rgb(80,80,80)";//grid
    for(let i=0;i<this.props.field.width+1;i++){
      this.ctx.fillRect(i*100-.5,0,1,this.props.field.height*100);
    }
    for(let i=0;i<this.props.field.height+1;i++){
      this.ctx.fillRect(0,i*100-.5,this.props.field.width*100,1);
    }

    for(const {x,y,type} of this.props.field){//draw field
      this.ctx.save();
      this.ctx.translate(x*100,y*100);
      Field.renderTile(type,this.ctx);
      this.ctx.restore();
    }
    this.props.robot.render(this.ctx);//draw robot
  }
}
export default Screen;
