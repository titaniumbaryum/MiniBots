import React from 'react';
import Text from "./Text";
export default {
  "tiles":[
    ["","","","","","","","","","","","","","","","","","exit"]
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
      "left":{
        "editor":{
          "point":[
            0,
            0
          ],
          "color":"#ffffff",
          "name":"Left"
        },
        "steps":1,
        "type":"Left"
      }
    },
    "links":{
      "start-left":{
        "start":"start",
        "output":" ",
        "end":"left",
        "editor":{
          "color":"#ffffff"
        }
      }
    }
  },
  "title":"5. The Corridor.",
  "description":"It's Long, very Long.",
  "text":<Text/>,
  "icon":"autorenew"
};
