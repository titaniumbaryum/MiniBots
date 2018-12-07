import React, { Component } from 'react';
import './App.css';
import Editor from './Editor/Editor';
import Tester from './Tester/Tester';
import Field from './Game/Field';
import Robot from './Game/Robot';

let s=false;
let testField = new Field([
  ["wall-S","wall-E","source","","","","","","",""],
  ["exit","wall-SEW","","sink","","","","","",""],
  ["","","","","","","","","",""],
]);
let testRobot = new Robot(testField,[0,2]);
window.robot=testRobot;
class App extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      s?<Editor/>:
      <Tester field={testField} robot={testRobot}/>
    );
  }
}

export default App;
