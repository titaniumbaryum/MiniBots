import React, { Component } from 'react';
import './Tester.css';
import Screen from './Screen'

class Tester extends Component {
  // constructor(props){
  //   super(props);
  // }
  render(){
    return (<div className="tester-box">
      <button onClick={this.props.onClose}>close</button>
      <Screen field={this.props.field} robot={this.props.robot}/>
    </div>);
  }

}
export default Tester;
