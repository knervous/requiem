import { Typography } from '@mui/material';
import React from 'react';
import Draggable from 'react-draggable';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';
import { useUiContext } from '../component';
import HealthBar from '../health-bar/component';
import { usePersistentUiLoc } from '../hooks/usePersistentUiLoc';

import './component.scss';

export const Group = ({ rootNode }) => {
  const { onStop, x, y, show } = usePersistentUiLoc('group', rootNode);
  const { height, width } = useWindowDimensions();
  const { embedded } = useUiContext();
  return show ? 
    <Draggable
      onStop={onStop}
      position={embedded ? { x: width - 165, y: height - 130 - ([].length * 20) } : { x, y }}
      handle=".ui-element-group"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <div className="ui-element">
        <Typography sx={{ fontSize: 13, padding: 0, margin: 0 }} gutterBottom>Group</Typography>
        <div className="ui-element-group" style={{ cursor: 'grab' }}>
          {[{ displayedName: 'Groupmember', hp: 50, maxHp: 100 }].map(groupMember => {
            return <div key={`group-${groupMember.id}`}>
              <Typography sx={{ fontSize: 13, padding: 0, margin: 0 }} gutterBottom>{groupMember?.displayedName}</Typography>
              <HealthBar width={110} pct={Math.round(groupMember?.hp / groupMember?.maxHp * 100)} display={`${groupMember?.hp} / ${groupMember?.maxHp}`} style={{ marginTop: 5 }} />
            </div>;
          })}
          
        </div>
        
      </div>
    </Draggable>
    : null;
};
