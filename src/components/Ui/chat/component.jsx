import { TextField, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';

import { usePersistentUiLoc } from '../hooks/usePersistentUiLoc';
import './component.scss';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { ChatState, ZoneState, useSelector } from '../../../state';
import { ZoneSocket } from '../../../net/socket';
import * as ZonePacket from '../../../net/packet/ZonePackets';
import { OP_CODES } from '../../../net/packet/opcodes';


const CHANNEL =
{
  Guild        : 0,
  Group        : 2,
  Shout        : 3,
  Auction      : 4,
  OOC          : 5,
  Broadcast    : 6,
  Tell         : 7,
  Say          : 8,
  Petition     : 10,
  GMSAY        : 11,
  TellEcho     : 14,
  Raid         : 15,
  UNKNOWN_Guild: 17,
  UNKNOWN_GMSAY: 18,
  UCSRelay     : 20,
  Emotes       : 22
};

const chatMessages = {
  [CHANNEL.Guild]        : 'lightgreen',
  [CHANNEL.Group   ]     : 'teal',
  [CHANNEL.Shout  ]      : 'red',
  [CHANNEL.Auction  ]    : 'darkgreen',
  [CHANNEL.OOC       ]   : 'darkgreen',
  [CHANNEL.Broadcast  ]  : 'yellow',
  [CHANNEL.Tell     ]    : 'purple',
  [CHANNEL.Say  ]        : 'white',
  [CHANNEL.Petition  ]   : 'white',
  [CHANNEL.GMSAY  ]      : 'red',
  [CHANNEL.TellEcho  ]   : 'white',
  [CHANNEL.Raid     ]    : 'teal',
  [CHANNEL.UNKNOWN_Guild]: 'white',
  [CHANNEL.UNKNOWN_GMSAY]: 'white',
  [CHANNEL.UCSRelay  ]   : 'white',
  [CHANNEL.Emotes ]      : 'white'
};

const parseChat = (line, idx) => {
  let text = '';
  switch (line.channel) {
    case CHANNEL.Guild:
      text = `${line.sender} tells the guild, "${line.message}"`;
      break;
    case CHANNEL.Group:
      text = `${line.sender} tells the group, "${line.message}"`;
      break;
    case CHANNEL.Shout:
      text = `${line.sender} shouts, "${line.message}"`;
      break;
    case CHANNEL.Auction:
      text = `${line.sender} auctions, "${line.message}"`;
      break;
    case CHANNEL.OOC:
      text = `${line.sender} says out of character, "${line.message}"`;
      break;
    case CHANNEL.Broadcast:
      text = `${line.sender} broadcasts, "${line.message}"`;
      break;
    case CHANNEL.Tell:
      text = `${line.sender} tells you, "${line.message}"`;
      break;
    default:
    case CHANNEL.Say:
      text = `${line.sender} says, "${line.message}"`;
      break;
    case CHANNEL.Petition:
      text = `${line.sender} petitions, "${line.message}"`;
      break;
    case CHANNEL.GMSAY:
      text = `${line.sender} says, "${line.message}"`;
      break;
    case CHANNEL.Emotes:
      text = `${line.sender} ${line.message}`;
      break;
  }

  return <Typography
    key={`chat-${idx}`}
    sx={{
      fontSize: 15,
      padding : 0,
      margin  : 0,
      color   : chatMessages[line.channel],
    }}
    gutterBottom
  >
    {text}
  </Typography>;
};

const getColor = (color) => {
  switch (color) {
    case 0xff + 4: // guild
      return 'lightgreen';
    case 0:
      return 'white';
    case 1:
      return 'darkgray';
    case 2:
      return 'darkgreen';
    case 3:
    case 4:
      return 'darkblue';
    case 0xff + 2: // tell
    case 5:
      return 'purple';
    case 0xff + 5: // ooc
    case 0xff + 6: // auction
    case 14:
      return 'green';
    case 6:
      return 'lightgrey';
    case 0xff + 3:
    case 18:
      return 'lightblue';
    case 20:
      return 'darkgray';
    case 15:
      return 'yellow';
    case 0xff + 7: // shout
    case 13:
      return 'red';
    default:
      return 'white';
  }
};

export const Chat = ({ rootNode }) => {
  const { onStop, x, y, show, } = usePersistentUiLoc('chat', rootNode);
  const chatLines = useSelector(ChatState.lines);
  const name = useSelector(ZoneState.character);
  const [cmd, setCmd] = useState('');
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const handleKeyDown = useCallback(e => {
    if (e.key === 'Enter') {
      ZoneSocket.send(new ZonePacket.ChannelMessage(OP_CODES.OP_ChannelMessage, '', name, 0, CHANNEL.Say, [0, 0], 100, cmd));
      setCmd('');
    }
    e.stopPropagation();
  }, [cmd, name]);

  useEffect(() => {
    const listener = e => { 
      if (e.key === '/' && inputRef.current) {
        const input = inputRef.current.querySelector('input');
        input.focus();
        input.value = '/';
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatLines]);

  return show ? (
    <Draggable onStop={onStop} position={{ x, y }} handle=".ui-chat">
      <div className="ui-element">
        <div className="chat-handle">
          <Typography sx={{ fontSize: 13, padding: 0, margin: 0 }} gutterBottom>
            Chat
          </Typography>
        </div>

        <div
          ref={chatRef}
          className="ui-chat"
          style={{ maxHeight: 200, overflow: 'auto', minHeight: 200 }}
        >
          {chatLines.map((line, idx) => 
            parseChat(line, idx))
          }
        </div>
        <TextField
          ref={inputRef}
          size="small"
          onKeyDown={handleKeyDown}
          class="cmd-input"
          fullWidth
          id="outlined-basic"
          variant="outlined"
          value={cmd}
          onChange={(e) => {
            e.stopPropagation();
            setCmd(e.target.value);
          }}
        />
      </div>
    </Draggable>
  ) : null;
};
