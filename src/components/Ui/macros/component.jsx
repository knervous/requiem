import {
  Button,
  DialogActions,
  IconButton,
  ListItem,
  Typography,
} from '@mui/material';
import React, { useCallback, useContext } from 'react';
import Draggable from 'react-draggable';

import { usePersistentUiLoc } from '../hooks/usePersistentUiLoc';
import './component.scss';

import { useMq } from '../hooks/useMq';

import List from '@mui/material/List';

import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { MacroContext } from '../../Context/macroContext';
import EditIcon from '@mui/icons-material/Edit';

export const Macros = () => {
  const { onStop, x, y, show } = usePersistentUiLoc('macros');

  const mq = useMq();

  const { addMacro, deleteMacro, macros, setEditingMacro, openEditor } = useContext(
    MacroContext,
  );

  const runMacro = useCallback(macro => {
    if (mq?.doMacro) {
      mq.doMacro(macro?.text);
    }
    
  }, [mq]);

  return show ? (
    <Draggable onStop={onStop} defaultPosition={{ x, y }} handle=".chat-handle">
      <div className="ui-element ui-element-macro-box">
        <div className="chat-handle">
          <Typography sx={{ fontSize: 13, padding: 0, margin: 0 }} gutterBottom>
            Macros
          </Typography>
        </div>

        <List className="macro-list">
          {macros.map((m) => (
            <ListItem
              secondaryAction={
                <div className="macro-sec-actions">
                  <IconButton edge="end" aria-label="delete">
                    <PlayArrowIcon onClick={() => runMacro(m)} />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <EditIcon onClick={() => {
                      setEditingMacro(m);
                      openEditor();
                    }} />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon onClick={() => deleteMacro(m.id)} />
                  </IconButton>
                </div>
              }
            >
              <ListItemText primary={m.name} />
            </ListItem>
          ))}
        </List>
        <DialogActions className="macro-editor-buttons draggable">
          <Button onClick={addMacro}>
            <Typography sx={{ marginRight: 2 }}>New Macro</Typography>
            <AddBoxIcon></AddBoxIcon>
          </Button>
        </DialogActions>
      </div>
    </Draggable>
  ) : null;
};
