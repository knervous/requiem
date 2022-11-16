import { Typography } from '@mui/material';
import React, { useContext } from 'react';
import Draggable from 'react-draggable';
import { ZoneContext } from '../../Zone/component';
import { classes } from '../../Zone/rendered-zone';
import HealthBar from '../health-bar/component';
import { usePersistentUiLoc } from '../hooks/usePersistentUiLoc';

import './component.scss';

export const Character = ({ rootNode }) => {
  const { character } = useContext(ZoneContext);
  const { onStop, x, y, show } = usePersistentUiLoc('character', rootNode);
  return show && character ? 
    <Draggable
      onStop={onStop}
      position={{ x, y }}
      handle=".ui-element-character"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <div className="ui-element">
        <div className="ui-element-character" style={{ cursor: 'grab' }}> 
          <Typography sx={{ fontSize: 13, padding: 0 }} gutterBottom>{character?.displayedName}</Typography>
          <Typography sx={{ fontSize: 13, padding: 0 }} gutterBottom>Level {character?.level} {classes[character.classId]}</Typography>
          <HealthBar width={110} pct={Math.round(character?.hp / character?.maxHp * 100)} display={`${character?.hp} / ${character?.maxHp}`} style={{ marginTop: 5 }} />

        </div>
        
      </div>
    </Draggable>
    : null;
};
