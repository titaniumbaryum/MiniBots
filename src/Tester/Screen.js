import React, { Component } from 'react';
import './Field.css';

class Field extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="field-box">
        <canvas ref={c => this.c = c}></canvas>
      </div>
    );
  }
  componentDidMount(){
    this.componentDidUpdate();
  }
  componentDidUpdate(){
    this.ctx = this.c.getContext("2d");
  }
  componentWillUnmount(){

  }
  update(){
    if(!this.props.field) return;
    this.c.width = this.c.clientWidth;
    this.ctx.resetTransform();
    const resizeRatio = this.c.width/100/this.props.field.width;
    this.ctx.scale(resizeRatio,resizeRatio);
    this.ctx.fillStyle = "grey";
    for(let i=0;i<this.props.field.width;i++){
      this.ctx.fillRect(i*100,0,1,this.props.field.height*100);
    }
    for(let i=0;i<this.props.field.height;i++){
      this.ctx.fillRect(i*100,0,this.props.field.width*100,1);
    }
  }
}
export default Field;
