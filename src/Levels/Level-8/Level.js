import React from 'react';
import Text from "./Text";
function autoTile(tiles){
  const o=[];
  for(let i=0;i<tiles.length;i++){
    const r=[];
    for(let j=0;j<tiles[i].length;j++){
      let t="";
      if(tiles[i][j]==2){
        t="exit";
      }else if(tiles[i][j]==1){
        t="wall-"
        if(tiles[i-1] && tiles[i-1][j]!=1){
          t+="N";
        }
        if(tiles[i+1] && tiles[i+1][j]!=1){
          t+="S";
        }
        if(typeof tiles[i][j-1] != "undefined" && tiles[i][j-1]!=1){
          t+="W";
        }
        if(typeof tiles[i][j+1] != "undefined" && tiles[i][j+1]!=1){
          t+="E";
        }
      }
      r.push(t);
    }
    o.push(r);
  }
  return o;
}
export default {
  "tiles":autoTile([
    [0,1,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
    [0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0],
    [0,0,0,0,0,0,1,0,1,0,0,0,1,1,1,0,0,1,0,0],
    [1,1,1,1,1,0,1,1,1,0,1,0,0,1,1,1,0,1,0,1],
    [0,0,0,0,0,0,1,0,0,0,1,1,0,1,1,0,0,1,0,0],
    [0,1,1,1,1,0,1,0,1,0,1,0,0,1,1,0,1,1,1,0],
    [0,0,0,0,1,0,0,0,1,0,1,0,1,1,1,0,0,1,0,0],
    [1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0],
    [0,1,0,1,0,1,0,1,0,0,1,0,1,1,1,1,0,1,1,1],
    [0,1,0,0,0,1,0,1,0,1,1,0,1,0,0,0,0,0,0,0],
    [0,1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,1,1,1,1],
    [0,1,0,1,0,0,0,1,1,0,1,0,1,1,0,0,0,0,0,0],
    [0,0,0,1,0,1,1,1,0,0,1,0,1,1,1,1,1,1,1,0],
    [0,1,0,1,0,1,0,0,0,1,1,0,0,0,1,0,0,0,1,1],
    [0,1,0,1,0,0,0,1,0,0,1,1,1,0,0,0,1,0,0,2],
  ]),
  "start":[0,0],
  "mesh":{},
  "title":"8. A-Maze-ing.",
  "description":"Getting out will be trick-y.",
  "text":<Text/>,
  "icon":"nfc"
};
