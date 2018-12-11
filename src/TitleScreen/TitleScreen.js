import React, { Component } from 'react';
import './TitleScreen.css';

class TitleScreen extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const levels = [];
    for(const level of this.props.levels){
      levels.push(<div className="level" onClick={()=>this.props.onSelect(level)}>
        <i className="material-icons level-icon">{level.icon}</i>
        <h3 className="level-title">{level.title}</h3>
        <p className="level-title">{level.description}</p>
      </div>);
    }
    return (<div className="titlescreen-box">
      <div className="content">
        <h1>MiniBots</h1>
        <p>A game where you learn to code by making node networks.</p>
        <Separator/>
        <h2>Levels</h2>
        <div className="levels">{levels}</div>
        <Separator/>
        <p>Made with ❤ and react by <a href="//titouan.eu">Titouan Baillon</a>.</p>
      </div>
    </div>);
  }
}
function Separator(props){
  return <div className="separator"></div>;
}
export default TitleScreen;
