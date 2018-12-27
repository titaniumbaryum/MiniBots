import React from 'react';
export default props=>(
  <div>
    <h1>How to start meshing!</h1>
    You can drag <b>Nodes</b> onto the <b>Mesh Area</b> then connect them by dragging a <b>Link</b> from a <b>Node Output</b> to a <b>Node</b>.<br/>
    Each <b>Node</b> can receive and/or emmit a signal through connected <b>Links</b>.
    <h2>The Nodes</h2>
    <ul>
      <li><b>The Pulse Node</b> emmit a signal once when the level begin.</li>
      <li><b>The Forward Node</b> try to move the robot forward one or more time.</li>
    </ul>
  </div>
);
