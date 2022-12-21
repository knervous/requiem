import { Typography } from '@mui/material';
import React, { useCallback, useContext, useMemo } from 'react';
import Draggable from 'react-draggable';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';
import { ZoneContext } from '../../Zone/component';
import { useUiContext } from '../component';
import HealthBar from '../health-bar/component';
import { usePersistentUiLoc } from '../hooks/usePersistentUiLoc';

import './component.scss';

export const Target = ({ rootNode }) => {
  const { width } = useWindowDimensions();
  const { embedded } = useUiContext();
  const { character, spawnContextMenu } = useContext(ZoneContext);
  const { onStop, x, y, show } = usePersistentUiLoc('target', rootNode);
  const display = useMemo(() => {
    if (!character?.target) {
      return '';
    }
    return `${Math.round(character?.target?.hp / character?.target?.maxHp * 100)}%`;
  }, [character?.target]);

  const pct = useMemo(() => {
    if (!character?.target) {
      return 0;
    }
    return Math.round(character?.target?.hp / character?.target?.maxHp * 100);
  }, [character]);

  const onContextMenu = useCallback(e => {
    e.preventDefault();
    if (character?.target) {
      spawnContextMenu(character?.target);
    }
  }, [character?.target, spawnContextMenu]);

  return show ? 
    <Draggable
      onStop={onStop}
      position={embedded ? { x: (width / 2) - 85, y: 70 } : { x, y }}
      handle=".ui-element-target-box"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <div className="ui-element" onContextMenu={onContextMenu}>
        <Typography sx={{ fontSize: 13, padding: 0, margin: '0 0 -3px 0' }} color="text.secondary" gutterBottom>Target</Typography>
        <div className="ui-element-target-box" style={{ cursor: 'grab' }}> {character?.target?.displayedName ?? ''} </div>
        {character?.target && <HealthBar width={150} pct={pct} display={display} style={{ margin: '10px' }}/>}
        
      </div>
    </Draggable>
    : null;
};
