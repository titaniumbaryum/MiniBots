import React, { Component } from 'react';
import './App.css';
import Editor from './Editor/Editor'

class App extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <Editor></Editor>
    );
  }
}

export default App;
