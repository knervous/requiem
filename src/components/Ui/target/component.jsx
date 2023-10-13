import { Typography } from '@mui/material';
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';
import { useUiContext } from '../component';
import HealthBar from '../health-bar/component';
import { usePersistentUiLoc } from '../hooks/usePersistentUiLoc';

import './component.scss';

export const Target = ({ rootNode }) => {
  const { width } = useWindowDimensions();
  const { embedded } = useUiContext();
  const { onStop, x, y, show } = usePersistentUiLoc('target', rootNode);
  const [targetName, setTargetName] = useState('');

  window.setTargetName = targetName => {
    setTargetName(targetName);
  };

  return show ? 
    <Draggable
      onStop={onStop}
      position={embedded ? { x: (width / 2) - 85, y: 70 } : { x, y }}
      handle=".ui-element-target-box"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <div className="ui-element">
        <Typography sx={{ fontSize: 13, padding: 0, margin: '0 0 -3px 0' }} color="text.secondary" gutterBottom>Target</Typography>
        <div className="ui-element-target-box" style={{ cursor: 'grab' }}> {targetName} </div>
        <HealthBar width={150} pct={50} style={{ margin: '10px' }}/>
        
      </div>
    </Draggable>
    : null;
};
