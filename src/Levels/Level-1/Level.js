import React from 'react';
import Text from "./Text";
export default {
  "tiles":[
    [""],
    ["exit"]
  ],
  "start":[0,0],
  "mesh":{
    "nodes":{
      "start":{
        "editor":{
          "point":[
            0,
            -200
          ],
          "color":"#ffffff",
          "name":"Start"
        },
        "type":"PulseNode"
      },
      "forward":{
        "editor":{
          "point":[
            0,
            0
          ],
          "color":"#ffffff",
          "name":"Forward"
        },
        "steps":1,
        "type":"Forward"
      }
    },
    "links":{
      "start-forward":{
        "start":"start",
        "output":" ",
        "end":"forward",
        "editor":{
          "color":"#ffffff"
        }
      }
    }
  },
  "title":"1. The Basics",
  "description":"An introduction to the interface and everything.",
  "text":<Text/>,
  "icon":"accessibility"
};
