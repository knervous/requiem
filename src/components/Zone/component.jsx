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
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import { InputLabel, MenuItem, Select, Typography, FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

import {
  Canvas,
} from '@react-three/fiber';

import { CameraControls } from './camera-controls';
import { RenderedZone, PaperComponent } from './rendered-zone';
import { Loader } from './loader';
import './component.scss';
import { useMemo } from 'react';
import { useToasts } from 'react-toast-notifications';
import { DesktopMacSharp } from '@mui/icons-material';

const spawnColumns = [
  { field: 'displayedName', headerName: 'Name', width: 200 },
  { field: 'level', headerName: 'Level', type: 'number', width: 100 },
  {
    field      : 'type',
    headerName : 'Player Type',
    width      : 150,
    sortable   : false,
    valueGetter: (params) =>
      params.row.type === 0 ? 'PC' : params.row.type === 1 ? 'NPC' : 'Corpse',
  },
  {
    field      : 'location',
    headerName : 'Location (X,Y,Z)',
    width      : 150,
    sortable   : false,
    valueGetter: (params) =>
        `${params.row.x.toFixed(1)}, ${params.row.y.toFixed(
          1,
        )}, ${params.row.z.toFixed(1)}`,
  },
  { field: 'hp', headerName: 'Current HP', width: 150, sortable: false },
  { field: 'maxHp', headerName: 'Max HP', width: 100, sortable: false },
];

export const Zone = () => {
  const dataGridRef = useRef();
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
  const [showNpcs, setShowNpcs] = useState(true);
  const [showPoi, setShowPoi] = useState(true);

  const [processes, setProcesses] = useState([]);
  const [pendingRetry, setPendingRetry] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [zone, setZone] = useState(null);
  const [zoneDetails, setZoneDetails] = useState([]);
  const [nextDateUpdateCallback, setNextDataUpdateCallback] = useState(null);
  const [spawns, setSpawns] = useState([]);
  const [character, setCharacter] = useState({});
  const [filteredSpawns, setFilteredSpawns] = useState(spawns);
  const [myTarget, setMyTarget] = useState('');
  const cameraControls = useRef();
  const retryRef = useRef(false);

  const { addToast } = useToasts();

  const socket = useMemo(() => {
    const socket = io('wss://192.168.2.102:4500');
    socket.on('activeProcesses', setProcesses);
    socket.on('setSpawns', spawns => {
      setSpawns(spawns); 
      setFilteredSpawns(spawns);
    });

    socket.on('spawn', spawns => {
      spawns.forEach(spawn => {
        addToast(<><span>Mob spawned: {spawn.displayedName}</span><Button onClick={() => {
          setMyTarget(spawn); 
        }}>Jump to Target</Button></>, { appearance: 'info' });
      });
      
    });
    socket.on('despawn', despawns => {
      despawns.forEach(spawn => {
        addToast(`Mob Despawned: ${spawn.displayedName}`, { appearance: 'info' });
      });
    });
    socket.on('charInfo', ({ character, zone }) => {
      setCharacter(character);
      setZone(zone);
    });
    socket.on('lostProcess', async processId => {
      console.log('Got pid', processId);
      setSelectedProcess(null);
      setPendingRetry(true);
      let retries = 0;
      while (retries < 10 && retryRef.current === false) {
        await new Promise(res => setTimeout(res, 3000));
        const newProcess = await new Promise(res => socket.emit('checkProcess', processId, res));
        
        console.log('New process', newProcess);
        if (newProcess) {
          setSelectedProcess(newProcess);
          setProcesses(processes => processes.map(p => p.processId === newProcess.processId ? newProcess : p));
          break;
        }
        retries++;
      }
      retryRef.current = false;
      setPendingRetry(false);
    });
    return socket;
  }, []);

  const handleRefreshProcess = useCallback(() => {
    socket.emit('refreshProcesses');
    setPendingRetry(false);
    retryRef.current = true;
  }, [socket]);

  const onFilterModelChange = useCallback(
    ({ items }) => {
      if (!items.every((i) => i.value === undefined)) {
        setNextDataUpdateCallback(() => ({ filter: { visibleRowsLookup } }) => {
          setFilteredSpawns(
            Object.entries(visibleRowsLookup)
              .filter(([_, visible]) => visible)
              .map(([visibleRow]) =>
                spawns.find((s) => +s?.id === +visibleRow),
              ),
          );
          setNextDataUpdateCallback(null);
        });
      } else {
        setFilteredSpawns(spawns);
      }
    },
    [spawns],
  );

  useEffect(() => {
    setFilteredSpawns((filteredSpawns) =>
      filteredSpawns.map((f) => spawns.find((s) => s?.id === f?.id)),
    );
  }, [spawns, setFilteredSpawns]);

  useEffect(() => {
    if (!selectedProcess) {
      return;
    }
    (async () => {
      const result = await fetch(`/maps/${selectedProcess.zone.shortName}.txt`).then(r => r.text()).catch(() => null);
      if (result) {
        // P 636.0752, -299.8139, -0.9990,  0, 0, 0,  3,  Moreo_(Spells)
        const zoneDetails = [];
        for (const line of result.split('\n')) {
          if (line.startsWith('P')) {
            const [x, y, z, _1, _2, _3, _4, description] = line.slice(1).split(',').map(t => t.trim());
            zoneDetails.push({ x: +x * -1, y: +y * -1, z: +z, description });
          }
        }
        setZoneDetails(zoneDetails);
      }
    })();
    
    socket.emit('selectProcess', selectedProcess.processId);
  }, [selectedProcess, socket]);

  return (
    <Paper className="zone-container" elevation={1}>
      <Card className="zone-header" variant="outlined">
        <CardContent className="zone-header">
          <div className="btn-row">
            <Button variant="outlined" onClick={handleSearchOpen}>
              Spawn Search
            </Button>
            <Button variant="outlined" onClick={handleOptionsOpen}>
              Options
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                if (zoneRef.current) {
                  zoneRef.current.targetMe();
                }
              }}
            >
              Jump to Me
            </Button>
            <Button variant="outlined" onClick={() => {
              if (zoneRef.current) {
                zoneRef.current.followMe(!cameraFollowMe);
                setCameraFollowMe(!cameraFollowMe);
              }
            }}>
              {cameraFollowMe ? 'Unfollow me' : 'Follow me'}
            </Button>
            <Button variant="outlined" onClick={handleRefreshProcess}>
              Refresh Processes
            </Button>
            <div style={{ maxWidth: 300, minWidth: 300 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{pendingRetry ? 'Attempting Reconnect...' : 'Process'}</InputLabel>
                <Select disabled={pendingRetry} value={selectedProcess} label="Process" displayEmpty onChange={({ target: { value } }) => setSelectedProcess(value)}>
                  {processes.map(p => <MenuItem value={p}>{p.zone.characterName} - {p.zone.longName}</MenuItem>)}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Search Dialog */}
          <Dialog
            open={searchOpen}
            onClose={handleSearchClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              Spawn Search and Filter
            </DialogTitle>
            <DialogContent>
              <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                  onRowClick={({ row }) => {
                    setMyTarget(row);
                  }}
                  onFilterModelChange={onFilterModelChange}
                  onStateChange={nextDateUpdateCallback}
                  ref={dataGridRef}
                  columns={spawnColumns}
                  rows={spawns}
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  componentProps={{
                    toolbar: { className: 'myclassname' }
                  }}
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
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              Options
            </DialogTitle>
            <DialogContent>
              <div style={{ height: 400, width: '100%' }}>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Max Distance for Spawn Name: {maxTargetDisplay}
                </Typography>
                <Slider
                  value={maxTargetDisplay}
                  onChange={(e) => setMaxTargetDisplay(+e.target.value)}
                  step={10}
                  min={0}
                  max={5000}
                />
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Font Size: {fontSize}px
                </Typography>
                <Slider
                  value={fontSize}
                  onChange={(e) => setFontSize(+e.target.value)}
                  step={1}
                  min={5}
                  max={25}
                />
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={showNpcs} onChange={({ target: { checked } }) => setShowNpcs(checked)} />} label="Show NPCs" />
                  <FormControlLabel control={<Checkbox checked={showPoi} onChange={({ target: { checked } }) => setShowPoi(checked)} />} label="Show points of interest" />
                </FormGroup>
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
            {selectedProcess && zone && (
              <Suspense fallback={<Loader />}>
                <RenderedZone
                  zoneDetails={showPoi ? zoneDetails : []}
                  character={character}
                  ref={zoneRef}
                  maxTargetDisplay={maxTargetDisplay}
                  spawns={showNpcs ? filteredSpawns.filter(Boolean) : []}
                  myTarget={myTarget}
                  setMyTarget={setMyTarget}
                  controls={cameraControls}
                  zoneName={zone.shortName}
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
                  pointerEvents: 'none',
                }}
                width={threeRef.current.width}
                height={threeRef.current.height}
                ref={canvasRef}
              ></canvas>,
              threeRef.current.parentNode,
            )}
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Paper>
  );
};
