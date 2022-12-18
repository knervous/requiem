import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  IconButton,
  ListItem,
  Typography,
} from '@mui/material';
import React, { useCallback, useContext, useRef } from 'react';
import Draggable from 'react-draggable';
import { useConfirm } from 'material-ui-confirm';

import { usePersistentUiLoc } from '../hooks/usePersistentUiLoc';
import './component.scss';

import { useMq } from '../hooks/useMq';

import List from '@mui/material/List';

import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import StopIcon from '@mui/icons-material/Stop';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DownloadIcon from '@mui/icons-material/Download';
import { MacroContext } from '../../Context/macroContext';
import EditIcon from '@mui/icons-material/Edit';
import { ZoneContext } from '../../Zone/component';
import Tooltip from '@mui/material/Tooltip';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import BugReportIcon from '@mui/icons-material/BugReport';
import Mq from '!raw-loader!../../../common/mq.d.ts' // eslint-disable-line

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export const Macros = ({ rootNode }) => {
  const { macroRunning } = useContext(ZoneContext);
  const { onStop, x, y, show } = usePersistentUiLoc('macros', rootNode);
  const fileInput = useRef();

  const mq = useMq();
  const confirm = useConfirm();
  const {
    addMacro,
    uploadMacro,
    deleteMacro,
    macros,
    setEditingMacro,
    openEditor,
  } = useContext(MacroContext);

  const runMacro = useCallback(
    (macro) => {
      if (mq?.doMacro) {
        mq.doMacro(macro?.text);
      }
    },
    [mq],
  );
  const handleUpload = useCallback(
    ({ target }) => {
      const fileReader = new FileReader();

      fileReader.readAsText(target.files[0]);
      fileReader.onload = (e) => {
        uploadMacro(target.files[0].name, e.target.result);
      };
    },
    [uploadMacro],
  );
  const onDelete = useCallback(
    (id) => {
      confirm({
        dialogProps: { size: 'small' },
        description: (
          <Typography sx={{ color: 'whitesmoke' }}>
            This action cannot be undone. Be sure to back up macro files with
            the download option.
          </Typography>
        ),
        titleProps: { sx: { color: 'white !important' } },
      })
        .then(() => {
          /* ... */
          deleteMacro(id);
        })
        .catch(() => {
          /* ... */
        });
    },
    [confirm, deleteMacro],
  );
  return show ? (
    <Draggable onStop={onStop} position={{ x, y }} handle=".chat-handle">
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
                  <Tooltip title="Download">
                    <IconButton
                      onClick={() => download(m.name, m.text)}
                      edge="end"
                      aria-label="download"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Run Macro">
                    <IconButton
                      onClick={() => runMacro(m)}
                      edge="end"
                      aria-label="play"
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Macro">
                    <IconButton
                      onClick={() => {
                        setEditingMacro(m);
                        openEditor();
                      }}
                      edge="end"
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Macro">
                    <IconButton
                      onClick={() => onDelete(m.id)}
                      edge="end"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              }
            >
              <ListItemText primary={m.name} />
            </ListItem>
          ))}
        </List>

        <DialogActions
          sx={{
            alignContent  : 'center',
            justifyContent: 'end',
            color         : 'whitesmoke',
          }}
          className="macro-buttons"
        >
          <Tooltip title="Download Typescript Definitions">
            <Button onClick={() => download('mq.d.ts', Mq)}>
              <DownloadIcon sx={{ color: 'whitesmoke' }} />
              <Typography
                sx={{ fontSize: 14, marginLeft: 1, color: 'whitesmoke' }}
              >
                mq.d.ts
              </Typography>
            </Button>
          </Tooltip>
          <Tooltip title="Import Existing Macros">
            <Button onClick={() => fileInput.current.click()}>
              <FileUploadIcon sx={{ color: 'whitesmoke' }} onClick={() => {}} />
              <Typography
                sx={{ fontSize: 14, marginLeft: 1, color: 'whitesmoke' }}
              >
                Import
              </Typography>
            </Button>
          </Tooltip>
        </DialogActions>
        <Box
          sx={{
            display       : 'flex',
            justifyContent: 'space-between',
            alignContent  : 'center',
            height        : 35,
          }}
        >
          {macroRunning ? (
            <Box className="macro-info" sx={{ display: 'flex', alignContent: 'center' }}>
              <CircularProgress
                size={15}
                sx={{ marginRight: 1, marginTop: 0.3 }}
              />
              <Typography
                sx={{ fontSize: 14, marginBottom: 0, }}
                color="text.secondary"
                gutterBottom
              >
                Macro is running
              </Typography>
              <Tooltip title="Stop macro">
                <StopIcon sx={{ cursor: 'pointer' }}onClick={mq?.stopMacro} />
              </Tooltip>
          
            </Box>
          ) : (
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              No macro currently running.
            </Typography>
          )}
          <Tooltip title="Add New Macro">
            <IconButton sx={{ marginRight: 1.5 }} onClick={addMacro}>
              <AddBoxIcon></AddBoxIcon>
            </IconButton>
          </Tooltip>
        </Box>

        <input
          onChange={handleUpload}
          accept="text/*"
          ref={fileInput}
          type="file"
          style={{ display: 'none' }}
        />
      </div>
    </Draggable>
  ) : null;
};
