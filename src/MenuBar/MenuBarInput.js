import React, { Component } from 'react';

class MenuBarInput extends Component {
  constructor(props){
    super(props);

  }
  render(){
    return (
      <input className="menubarinput" value={this.props.value} onChange={e=>this.props.onChange(e.target.value)}/>
    );
  }
}
export default MenuBarInput;
