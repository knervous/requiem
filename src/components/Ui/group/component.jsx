import { Typography } from '@mui/material';
import React, { useContext } from 'react';
import Draggable from 'react-draggable';
import { ZoneContext } from '../../Zone/component';
import HealthBar from '../health-bar/component';
import { usePersistentUiLoc } from '../hooks/usePersistentUiLoc';

import './component.scss';

export const Group = ({ rootNode }) => {
  const { character, spawnContextMenu, groupMembers, doTarget } = useContext(ZoneContext);
  const { onStop, x, y, show } = usePersistentUiLoc('group', rootNode);

  return show && character ? 
    <Draggable
      onStop={onStop}
      position={{ x, y }}
      handle=".ui-element-group"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <div className="ui-element">
        <Typography sx={{ fontSize: 13, padding: 0, margin: 0 }} gutterBottom>Group</Typography>
        <div className="ui-element-group" style={{ cursor: 'grab' }}>
          {groupMembers.map(groupMember => {
            return <div key={`group-${groupMember.id}`}
              onClick={() => {
                doTarget(groupMember.id);
              }}
              onContextMenu={e => {
                spawnContextMenu(groupMember); e.preventDefault();
              }}>
              <Typography sx={{ fontSize: 13, padding: 0, margin: 0 }} gutterBottom>{groupMember?.displayedName}</Typography>
              <HealthBar width={110} pct={Math.round(groupMember?.hp / groupMember?.maxHp * 100)} display={`${groupMember?.hp} / ${groupMember?.maxHp}`} style={{ marginTop: 5 }} />
            </div>;
          })}
          
        </div>
        
      </div>
    </Draggable>
    : null;
};
