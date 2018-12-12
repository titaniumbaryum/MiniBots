import React, { Component } from 'react';

export default function MenuBarRange(props){
  return (
    <div className="menubarrange-holder">
      <div>{props.minText}</div>
      <input className="menubarrange" type="range" min={props.min} max={props.max} step={props.step} value={props.value} onChange={e=>props.onChange(e.target.value)}/>
      <div>{props.maxText}</div>
    </div>
  );
}
