import React, { Component } from 'react';
import './Tester.css';
import Screen from './Screen/Screen';
import WinPopup from './WinPopup/WinPopup';
import MenuBar from '../MenuBar/MenuBar';
import MenuBarItem from '../MenuBar/MenuBarItem';

class Tester extends Component {
  constructor(props){
    super(props);
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.reset = this.reset.bind(this);
    const update = ()=>{
      this.forceUpdate();
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
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
      <WinPopup robot={this.props.robot} mesh={this.props.mesh} onClose={this.props.onClose}></WinPopup>
    </div>);
  }
  componentDidMount(){
    this.active = true;
    const upd = ()=>{
      this.forceUpdate();
      if(this.active)requestAnimationFrame(upd);
    };
    requestAnimationFrame(upd);
  }
  componentWillUnmount(){
    this.active = false;
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
