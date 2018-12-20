import React, { Component } from 'react';
import "./Helper.css";

export default class Helper extends Component{
  constructor(props){
    super(props);
    this.state={
      open:false
    };
  }
  render(){
    if(!this.props.children)return null;
    if(this.open){
      return <HelperPopup onClose={()=>this.open=false}>{this.props.children}</HelperPopup>;
    }else{
      return <HelperButton onClick={()=>this.open=true}/>;
    }
  }
  get open(){return this.state.open}
  set open(open){this.setState((s,p)=>({open}))}
}
function HelperPopup(props){
  return <div className="helper-popup">{props.children}<button className="helper-popup-close" onClick={props.onClose}><i className="material-icons">close</i></button></div>;
}
function HelperButton(props){
  return <button className="helper-button" onClick={props.onClick}><i className="material-icons">textsms</i></button>
}
