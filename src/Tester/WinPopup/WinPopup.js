import React, { Component } from 'react';
import './WinPopup.css';

export default function WinPopup(props){
  const nodes = props.mesh.nodes.length;
  const error = props.robot.errors.length;
  const total = props.robot.history.length;
  const successful = total - error;
  const shareText = `I finished a level in MiniBots with ${nodes} instructions, ${total} actions and ${error?error:"no"} error${error!==1?"s":""}`;
  return (
    <div className={props.robot.won?"winpopup-frame open":"winpopup-frame"}>
      <h1>You won!</h1>
      <p>but you still can try to reduce your stats.</p>
      <div className="winpopup-grid">
        <BigNumber name="Nodes">{nodes}</BigNumber>
        <BigNumber name="Actions" max={total!==successful?successful:false}>{total}</BigNumber>
        {error?<BigNumber name="Errors" max="0">{error}</BigNumber>:<StatSuccess>No Errors</StatSuccess>}
      </div>
      <div className="winpopup-grid">
        {navigator.share?<button onClick={()=>share(shareText)}>Share</button>:""}
        <button onClick={props.onClose}>Return to editor</button>
      </div>
    </div>
  );
}
async function share(title){
  try {
    await navigator.share({ title, url: window.location.href });
    console.log("Data was shared successfully");
  } catch (err) {
    console.error("Share failed:", err.message);
  }
}
function BigNumber(props){
  return (
    <div className="winpopup-bignumber-frame">
      {props.name?<div className="winpopup-bignumber-name">{props.name}</div>:""}
      <div className="winpopup-bignumber-number">{props.children}</div>
      {props.max?<div className="winpopup-bignumber-max">/{props.max}</div>:""}
    </div>
  );
}
function StatSuccess(props){
  return (
    <div className="winpopup-StatSuccess-frame">
      {props.children}
      <div className="winpopup-StatSuccess-comment">well done!</div>
    </div>
  );
}
