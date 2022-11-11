import { TextField, Typography } from '@mui/material';
import React, { useContext, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { ZoneContext } from '../../Zone/component';

import { usePersistentUiLoc } from '../hooks/usePersistentUiLoc';
import './component.scss';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useMq } from '../hooks/useMq';

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

export const Chat = () => {
  const { chatLines, character } = useContext(ZoneContext);
  const { onStop, x, y, show, } = usePersistentUiLoc('chat');
  const [cmd, setCmd] = useState('');
  const chatRef = useRef(null);

  const mq = useMq();

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Enter') {
      mq?.doCommand(cmd);
      setCmd('');
    }
    
    e.stopPropagation();
  }, [cmd, mq]);
  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatLines]);
  return show && character ? (
    <Draggable onStop={onStop} defaultPosition={{ x, y }} handle=".ui-chat">
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
          {chatLines.map(({ message, color }) => (
            <Typography
              sx={{
                fontSize: 13,
                padding : 0,
                margin  : 0,
                color   : getColor(color),
              }}
              gutterBottom
            >
              {message}
            </Typography>
          ))}
        </div>
        <TextField
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
