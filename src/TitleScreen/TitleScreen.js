import React, { Component } from 'react';
import './TitleScreen.css';

class TitleScreen extends Component {
  constructor(props){
    super(props);
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.reset = this.reset.bind(this);
  }
  render(){
    const levels = [];
    for(const game of this.props.games){
      levels.push(<div className="level" onClick={()=>this.props.onSelect(game)}>{game.title}</div>);
    }
    return (<div className="titlescreen-box">
      <h1>MiniBots</h1>
      <div className="levels">{levels}</div>
    </div>);
  }
  pause(){
    this.props.mesh.pause();
  }
  play(){
    this.props.mesh.unpause();
  }
  reset(){
    this.pause();
    setTimeout(()=>{
      this.props.mesh.reset();
      this.props.robot.reset();
      this.play();
    },500);
  }
}
export default TitleScreen;
