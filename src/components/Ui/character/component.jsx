import { Typography } from '@mui/material';
import React from 'react';
import Draggable from 'react-draggable';
import HealthBar from '../health-bar/component';
import { usePersistentUiLoc } from '../hooks/usePersistentUiLoc';

import './component.scss';

export const Character = ({ rootNode }) => {
  const { onStop, x, y, show } = usePersistentUiLoc('character', rootNode);
  return show ? 
    <Draggable
      onStop={onStop}
      position={{ x, y }}
      handle=".ui-element-character"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <div className="ui-element">
        <div className="ui-element-character" style={{ cursor: 'grab' }}> 
          <Typography sx={{ fontSize: 13, padding: 0 }} gutterBottom>Soandso</Typography>
          <Typography sx={{ fontSize: 13, padding: 0 }} gutterBottom>Level 1 Warrior</Typography>
          <HealthBar width={110} pct={50} display={'100 / 100'} style={{ marginTop: 5 }} />

        </div>
        
      </div>
    </Draggable>
    : null;
};
