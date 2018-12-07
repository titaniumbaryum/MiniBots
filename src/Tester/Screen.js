import React, { Component } from 'react';
import './Screen.css';
import Field from '../Game/Field';

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
    if(!this.props.field) return;
    this.c.width = this.sizer.clientWidth;
    this.c.height = this.sizer.clientWidth/this.props.field.width*this.props.field.height;
    this.ctx.resetTransform();
    const resizeRatio = this.c.width/100/this.props.field.width;
    this.ctx.scale(resizeRatio,resizeRatio);
    this.ctx.fillStyle = "rgb(230,230,230)";
    for(let i=0;i<this.props.field.width;i++){
      this.ctx.fillRect(i*100-.5,0,1,this.props.field.height*100);
    }
    for(let i=0;i<this.props.field.height;i++){
      this.ctx.fillRect(0,i*100-.5,this.props.field.width*100,1);
    }
    for(const {x,y,type} of this.props.field){
      this.ctx.save();
      this.ctx.translate(x*100,y*100);
      Field.renderTile(type,this.ctx);
      this.ctx.restore();
    }
    this.props.robot.render(this.ctx);
  }
}
export default Screen;
