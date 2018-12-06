import React, { Component } from 'react';
import ColorCycler from '../../../ColorCycler';
import './ParamBar.css';

class ParamBar extends Component {
  constructor(props){
    super(props);
    this.__updateValue = this.__updateValue.bind(this);
    this.__updateEditorValue = this.__updateEditorValue.bind(this);
  }
  __updateValue(k,v){
    this.props.node.options[k]=v;
    this.props.node.update();
    this.forceUpdate();
    this.props.onUpdate();
  }
  __updateEditorValue(k,v){
    this.props.node.options.editor[k]=v;
    this.props.node.update();
    this.forceUpdate();
    this.props.onUpdate();
  }
  render(){
    const dom = [];
    if(this.props.node){
      dom.push(<ParamLabel text="Name"/>);
      dom.push(<ParamBox type="text" value={this.props.node.options.editor.name} onChange={v=>this.__updateEditorValue("name",v)}/>);
      dom.push(<ParamLabel text="Color"/>);
      dom.push(<ParamBox type="color" value={this.props.node.options.editor.color} onChange={v=>this.__updateEditorValue("color",v)}/>);
      dom.push(<button className="parambar-button" onClick={this.props.onDelete}>Delete</button>);
      dom.push(<Separator/>);
      for(let param of this.props.node.editor.parameters){
        dom.push(<ParamLabel text={param.name}/>);
        dom.push(<ParamBox type={param.type} value={this.props.node.options[param.key]} onChange={v=>this.__updateValue(param.key,v)}/>);
      }
    }
    return <div className="parambar-box">{dom}</div>;
  }
}
function ParamLabel(props){
  return <label>{props.text}</label>;
}
function Separator(props){
  return <div className="parambar-separator"></div>;
}
function ParamBox(props){
  if(props.type == "int"){
    return( <input type="number" value={props.value} onChange={e=>props.onChange(parseInt(e.target.value))}/> );
  }else if(props.type == "float"){
    return( <input type="number" value={props.value} onChange={e=>props.onChange(parseFloat(e.target.value))}/> );
  }else if(props.type == "text"){
    return( <input type="text" value={props.value} onChange={e=>props.onChange(e.target.value)}/> );
  }else if(props.type == "textarea"){
    return( <textarea value={props.value} onChange={e=>props.onChange(e.target.value)}></textarea> );
  }else if(props.type == "list"){
    return( <input type="text" value={props.value?props.value.join(","):""} onChange={e=>props.onChange(e.target.value.split(","))}/> );
  }else if(props.type == "color"){
    const dom = [];
    for(const color of ColorCycler.colors){
      dom.push(<div className="parambar-color" style={{color:color,boxShadow:props.value==color?"0 5px 10px -5px black":"none"}} onClick={e=>props.onChange(color)}></div>)
    }
    return( <div className="parambar-colors">{dom}</div> );
  }
}
export default ParamBar;
