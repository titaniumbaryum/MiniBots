import React, { Component } from 'react';
import './MenuBar.css';

class MenuBar extends Component {
  constructor(props){
    super(props);

  }
  render(){
    return <div className="menubar"><ul>{this.props.children.map(c=>(<li>{c}</li>))}</ul></div>
  }
}
export default MenuBar;
