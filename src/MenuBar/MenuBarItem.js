import React, { Component } from 'react';

class MenuBarItem extends Component {
  constructor(props){
    super(props);

  }
  render(){
    return (
      <div className="menubaritem" onClick={this.props.onClick}>
        <div className="menubaritem-icon">
          <i className="material-icons">{this.props.icon}</i>
        </div>
        <div className="menubaritem-text">{this.props.text}</div>
      </div>
    );
  }
}
export default MenuBarItem;
