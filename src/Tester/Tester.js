import React, { Component } from 'react';
import './Tester.css';
import Screen from './Screen'

class Tester extends Component {
  constructor(props){
    super(props);
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.reset = this.reset.bind(this);
  }
  render(){
    return (<div className="tester-box">
      <button onClick={this.props.onClose}>close</button>
      <button onClick={this.pause}>pause</button>
      <button onClick={this.play}>play</button>
      <button onClick={this.reset}>reset</button>
      <Screen field={this.props.field} robot={this.props.robot}/>
    </div>);
  }
  pause(){
    this.props.mesh.pause();
  }
  play(){
    this.props.mesh.unpause();
  }
  reset(){
    this.props.mesh.reset();
  }
}
export default Tester;
