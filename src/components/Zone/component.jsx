import React, {
  useState,
  useRef,
  Suspense,
  useCallback,
  useEffect
} from 'react';
import ReactDOM from 'react-dom';

import { io } from 'socket.io-client';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Slider from '@mui/material/Slider';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import {
  InputLabel,
  MenuItem,
  Select,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  TextField,
  InputAdornment
} from '@mui/material';

import { Canvas } from '@react-three/fiber';

import { CameraControls } from './camera-controls';
import { RenderedZone, PaperComponent } from './rendered-zone';
import { Loader } from './loader';
import './component.scss';
import { useMemo } from 'react';
import { useToasts } from 'react-toast-notifications';
import { supportedZones } from './data';

const supportedZoneOptions = supportedZones.map((zone, id) => ({
  label: zone,
  id
}));

const skyboxOptions = [
  'forest',
  'fullmoon',
  'halflife',
  'interstellar',
  'meadow',
  'nebula',
  'sand',
  'space'
];

const spawnColumns = [
  { field: 'displayedName', headerName: 'Name', width: 200 },
  { field: 'level', headerName: 'Level', type: 'number', width: 100 },
  {
    field      : 'type',
    headerName : 'Player Type',
    width      : 150,
    sortable   : false,
    valueGetter: params =>
      params.row.type === 0 ? 'PC' : params.row.type === 1 ? 'NPC' : 'Corpse'
  },
  {
    field      : 'location',
    headerName : 'Location (X,Y,Z)',
    width      : 150,
    sortable   : false,
    valueGetter: params =>
      `${params.row.x.toFixed(1)}, ${params.row.y.toFixed(
        1
      )}, ${params.row.z.toFixed(1)}`
  },
  { field: 'hp', headerName: 'Current HP', width: 150, sortable: false },
  { field: 'maxHp', headerName: 'Max HP', width: 100, sortable: false }
];

const zoneViewer = { zoneViewer: true };

export const Zone = () => {
  const zoneRef = useRef();
  const canvasRef = useRef(null);
  const threeRef = useRef(null);

  // Search Dialog
  const [searchOpen, setSearchOpen] = useState(false);
  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => setSearchOpen(false);

  // Options Dialog
  const [optionsOpen, setOptionsOpen] = useState(false);
  const handleOptionsOpen = () => setOptionsOpen(true);
  const handleOptionsClose = () => setOptionsOpen(false);

  // Options
  const [maxTargetDisplay, setMaxTargetDisplay] = useState(1000);
  const [fontSize, setFontSize] = useState(13);
  const [cameraFollowMe, setCameraFollowMe] = useState(false);
  const [showNpcs, setShowNpcs] = useState(false);
  const [showPoi, setShowPoi] = useState(true);
  const [skybox, setSkybox] = useState('meadow');
  const [spawnFilter, setSpawnFilter] = useState('');

  const [processes, setProcesses] = useState([]);
  const [pendingRetry, setPendingRetry] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(zoneViewer);
  const [zone, setZone] = useState(null);
  const [zoneDetails, setZoneDetails] = useState([]);
  const [spawns, setSpawns] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [character, setCharacter] = useState({});
  const [myTarget, setMyTarget] = useState('');
  const cameraControls = useRef();
  const retryRef = useRef(false);
  const zoneViewerRef = useRef(true);
  const { addToast } = useToasts();

  const socket = useMemo(() => {
    const socket = io('ws://192.168.2.102:4500', { secure: true });
    socket.on('activeProcesses', setProcesses);
    socket.on('setSpawns', spawns => {
      if (zoneViewerRef.current) {
        return;
      }
      setSpawns(spawns);
    });

    socket.on('spawn', spawns => {
      if (zoneViewerRef.current) {
        return;
      }
      spawns.forEach(spawn => {
        addToast(
          <>
            <span>Mob spawned: {spawn.displayedName}</span>
            <Button
              onClick={() => {
                setMyTarget(spawn);
              }}
            >
              Jump to Target
            </Button>
          </>,
          { appearance: 'info' }
        );
      });
    });
    socket.on('despawn', despawns => {
      if (zoneViewerRef.current) {
        return;
      }
      despawns.forEach(spawn => {
        addToast(`Mob Despawned: ${spawn.displayedName}`, {
          appearance: 'info'
        });
      });
    });
    socket.on('charInfo', ({ character, zone }) => {
      if (zoneViewerRef.current) {
        return;
      }
      setCharacter(character);
      setZone(zone);
    });
    socket.on('lostProcess', async processId => {
      if (zoneViewerRef.current) {
        return;
      }
      setSelectedProcess(null);
      setPendingRetry(true);
      let retries = 0;
      while (retries < 10 && retryRef.current === false) {
        await new Promise(res => setTimeout(res, 3000));
        const newProcess = await new Promise(res =>
          socket.emit('checkProcess', processId, res)
        );

        if (newProcess) {
          setSelectedProcess(newProcess);
          setProcesses(processes =>
            processes.map(p =>
              p.processId === newProcess.processId ? newProcess : p
            )
          );
          break;
        }
        retries++;
      }
      retryRef.current = false;
      setPendingRetry(false);
    });
    return socket;
  }, []) // eslint-disable-line

  const handleRefreshProcess = useCallback(() => {
    socket.emit('refreshProcesses');
    setPendingRetry(false);
    retryRef.current = true;
  }, [socket]);

  useEffect(() => {
    if (!selectedProcess) {
      return;
    }
    if (selectedProcess.zoneViewer) {
      zoneViewerRef.current = true;
      setZoneDetails([]);
      setSpawns([]);
      setCharacter(null);
    } else {
      zoneViewerRef.current = false;
    }
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    (async () => {
      const zoneDetails = await import('../../common/zoneDetails.json');
      setZoneDetails(
        zoneDetails[
          selectedProcess.zoneViewer
            ? selectedZone
            : selectedProcess.zone.shortName
        ] ?? []
      );
    })();
    if (!selectedProcess.zoneViewer) {
      socket.emit('selectProcess', selectedProcess.processId);
    }
  }, [selectedProcess, socket, selectedZone]);

  const filteredSpawns = useMemo(() => {
    return selectedProcess?.zoneViewer
      ? []
      : showNpcs
        ? spawns.filter(s => {
          if (spawnFilter.length) {
            return s?.displayedName?.includes?.(spawnFilter);
          }
          return Boolean(s);
        })
        : [];
  }, [selectedProcess, showNpcs, spawns, spawnFilter]);

  const zoneName = useMemo(
    () => (selectedProcess?.zoneViewer ? selectedZone : zone?.shortName),
    [selectedProcess, selectedZone, zone]
  );

  return (
    <Paper className='zone-container' elevation={1}>
      <Card className='zone-header' variant='outlined'>
        <CardContent className='zone-header'>
          <div className='btn-row'>
            <Button variant='outlined' onClick={handleSearchOpen}>
              Spawn Search
            </Button>
            <Button variant='outlined' onClick={handleOptionsOpen}>
              Options
            </Button>
            <Button
              variant='outlined'
              onClick={() => {
                if (zoneRef.current) {
                  zoneRef.current.targetMe();
                }
              }}
            >
              Jump to Me
            </Button>
            <Button
              variant='outlined'
              onClick={() => {
                if (zoneRef.current) {
                  zoneRef.current.followMe(!cameraFollowMe);
                  setCameraFollowMe(!cameraFollowMe);
                }
              }}
            >
              {cameraFollowMe ? 'Unfollow me' : 'Follow me'}
            </Button>
            <div style={{ maxWidth: 300, minWidth: 300 }}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>
                  {pendingRetry ? 'Attempting Reconnect...' : 'Process'}
                </InputLabel>
                <Select
                  startAdornment={
                    <InputAdornment position='start'>
                      <RefreshIcon sx={{ cursor: 'pointer' }} onClick={() => {
                        handleRefreshProcess();
                      }} />
                    </InputAdornment>
                  }
                  sx={{ height: 40 }}
                  disabled={pendingRetry}
                  value={selectedProcess ?? ''}
                  label='Process'
                  displayEmpty
                  onChange={({ target: { value } }) =>
                    setSelectedProcess(value)
                  }
                >
                  {processes.concat(zoneViewer).map(p =>
                    p.zoneViewer ? (
                      <MenuItem value={p}>Zone Viewer</MenuItem>
                    ) : (
                      <MenuItem value={p}>
                        {p.zone.characterName} - {p.zone.longName}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </div>
            {selectedProcess?.zoneViewer && (
              <Autocomplete
                blurOnSelect
                disablePortal
                onChange={(e_, { label = null } = {}) => {
                  if (label) {
                    setSelectedZone(null);
                    setTimeout(() => {
                      setSelectedZone(label);
                    }, 1);
                  }
                }}
                id='combo-box-demo'
                options={supportedZoneOptions}
                sx={{ width: 300 }}
                size='small'
                renderInput={params => (
                  <TextField
                    sx={{ height: 38 }}
                    {...params}
                    label='Zone'
                    value={selectedZone}
                  />
                )}
              />
            )}
            {
              spawns.length ? 
                <TextField
                  size="small"
                  onChange={({ target: { value } }) => setSpawnFilter(value)}
                  label='Spawn Filter'
                  value={spawnFilter}
                />
              
              
                : null
            }
          </div>

          {/* Search Dialog */}
          <Dialog
            open={searchOpen}
            onClose={handleSearchClose}
            PaperComponent={PaperComponent}
            aria-labelledby='draggable-dialog-title'
          >
            <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
              Spawn Search and Filter
            </DialogTitle>
            <DialogContent>
              <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                  onRowClick={({ row }) => {
                    setMyTarget(row);
                  }}
                  columns={spawnColumns}
                  rows={spawns}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleSearchClose}>
                Done
              </Button>
            </DialogActions>
          </Dialog>

          {/* Options Dialog */}
          <Dialog
            open={optionsOpen}
            onClose={handleOptionsClose}
            PaperComponent={PaperComponent}
            aria-labelledby='draggable-dialog-title'
          >
            <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
              Options
            </DialogTitle>
            <DialogContent>
              <div style={{ height: 400, width: '100%' }}>
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Max Distance for Spawn Name: {maxTargetDisplay}
                </Typography>
                <Slider
                  value={maxTargetDisplay}
                  onChange={e => setMaxTargetDisplay(+e.target.value)}
                  step={10}
                  min={0}
                  max={5000}
                />
                <Typography
                  sx={{ fontSize: 14 }}
                  color='text.secondary'
                  gutterBottom
                >
                  Font Size: {fontSize}px
                </Typography>
                <Slider
                  value={fontSize}
                  onChange={e => setFontSize(+e.target.value)}
                  step={1}
                  min={5}
                  max={25}
                />
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showNpcs}
                        onChange={({ target: { checked } }) =>
                          setShowNpcs(checked)
                        }
                      />
                    }
                    label='Show NPCs'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showPoi}
                        onChange={({ target: { checked } }) =>
                          setShowPoi(checked)
                        }
                      />
                    }
                    label='Show points of interest'
                  />
                </FormGroup>
                <FormControl sx={{ marginTop: 1 }} fullWidth>
                  <InputLabel id='demo-simple-select-label'>Skybox</InputLabel>
                  <Select
                    disabled={pendingRetry}
                    value={skybox ?? ''}
                    label='Skybox'
                    displayEmpty
                    onChange={({ target: { value } }) => setSkybox(value)}
                  >
                    {skyboxOptions.map(p => (
                      <MenuItem value={p}>{p}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleOptionsClose}>
                Done
              </Button>
            </DialogActions>
          </Dialog>
          <Canvas ref={threeRef}>
            {/* <SkyBox /> */}
            <CameraControls controls={cameraControls} ref={cameraControls} />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {selectedProcess && zoneName && (
              <Suspense fallback={<Loader />}>
                <RenderedZone
                  zoneDetails={showPoi ? zoneDetails : []}
                  character={selectedProcess?.zoneViewer ? null : character}
                  ref={zoneRef}
                  maxTargetDisplay={maxTargetDisplay}
                  spawns={filteredSpawns}
                  myTarget={selectedProcess?.zoneViewer ? null : myTarget}
                  setMyTarget={setMyTarget}
                  controls={cameraControls}
                  zoneName={zoneName}
                  skybox={skybox}
                  canvasRef={canvasRef}
                  fontSize={fontSize}
                />
              </Suspense>
            )}
          </Canvas>
          {threeRef.current &&
            ReactDOM.createPortal(
              <canvas
                style={{
                  position     : 'absolute',
                  top          : 0,
                  left         : 0,
                  pointerEvents: 'none'
                }}
                width={threeRef.current.width}
                height={threeRef.current.height}
                ref={canvasRef}
              ></canvas>,
              threeRef.current.parentNode
            )}
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Paper>
  );
};
