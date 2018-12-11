import React, { Component } from 'react';
import './Tester.css';
import Screen from './Screen';
import MenuBar from '../MenuBar/MenuBar';
import MenuBarItem from '../MenuBar/MenuBarItem';

class Tester extends Component {
  constructor(props){
    super(props);
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.reset = this.reset.bind(this);
  }
  render(){
    return (<div className="tester-box">
      <div className="header">
        <MenuBar>
          <MenuBarItem onClick={this.props.onClose} icon ="close" text="Close"/>
          <MenuBarItem onClick={this.pause} icon ="pause" text="Pause"/>
          <MenuBarItem onClick={this.play} icon ="play_arrow" text="Play"/>
          <MenuBarItem onClick={this.reset} icon ="settings_backup_restore" text="Reset"/>
        </MenuBar>
      </div>
      <div className="tester-grid">
        <div className="tester-screen"><Screen field={this.props.field} robot={this.props.robot}/></div>
        <div className="tester-sidebar"></div>
      </div>
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
export default Tester;
