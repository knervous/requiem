import React, {
  useState,
  useRef,
  Suspense,
  useCallback,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import { ColorPicker } from 'mui-color';
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
  InputAdornment,
} from '@mui/material';

import { Canvas } from '@react-three/fiber';

import { CameraControls } from './camera-controls';
import { RenderedZone, PaperComponent } from './rendered-zone';
import { Loader } from './loader';
import './component.scss';
import { useMemo } from 'react';
import { useToasts } from 'react-toast-notifications';
import { supportedZones } from './data';

const processMode =
  new URLSearchParams(window.location.search).get('mode') === 'process';

const supportedZoneOptions = supportedZones.map((zone, id) => ({
  label: zone,
  id,
}));

const skyboxOptions = [
  'forest',
  'fullmoon',
  'halflife',
  'interstellar',
  'meadow',
  'nebula',
  'sand',
  'space',
];

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
    headerName : 'Location (Y,X,Z)',
    width      : 150,
    sortable   : false,
    valueGetter: (params) =>
      `${params.row.y.toFixed(1)}, ${params.row.x.toFixed(
        1,
      )}, ${params.row.z.toFixed(1)}`,
  },
  { field: 'hp', headerName: 'Current HP%', width: 150, sortable: false },
  { field: 'maxHp', headerName: 'Max HP%', width: 100, sortable: false },
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

  // Connection Dialog
  const [connectionOptionsOpen, setConnectionOptionsOpen] = useState(false);
  const handleConnectionOptionsOpen = () => setConnectionOptionsOpen(true);

  // Options Dialog
  const [optionsOpen, setOptionsOpen] = useState(false);
  const handleOptionsOpen = () => setOptionsOpen(true);
  const handleOptionsClose = () => setOptionsOpen(false);

  // Options
  const [spawnFilter, setSpawnFilter] = useState('');
  const [options, setOptions] = useState(
    JSON.parse(
      localStorage.getItem('options') ??
        JSON.stringify({
          maxTargetDisplay: 1000,
          maxPoiDisplay   : 3000,
          fontSize        : 13,
          cameraFollowMe  : false,
          showNpcs        : true,
          showPcs         : true,
          showPoi         : true,
          showPoiLoc      : true,
          showGroup       : true,
          skybox          : 'interstellar',
          charColor       : { css: { backgroundColor: '#FFFFFF' } },
          groupColor      : { css: { backgroundColor: '#FFFFFF' } },
          address         : 'https://localhost:4500',
          token           : '',
        }),
    ),
  );
  const {
    maxTargetDisplay,
    maxPoiDisplay,
    fontSize,
    cameraFollowMe,
    showNpcs,
    showGroup,
    showPcs,
    showPoi,
    showPoiLoc,
    skybox,
    charColor,
    groupColor,
    address,
    token,
  } = options;

  useEffect(() => {
    if (socket) {
      return;
    }
    const { token } = JSON.parse(
      localStorage.getItem('options') ?? '{}');
    if (token) {
      doConnect();
    }
  }, []); // eslint-disable-line

  const setOption = (key, value) => {
    setOptions((options) => {
      const newOptions = { ...options, [key]: value };
      localStorage.setItem('options', JSON.stringify(newOptions));
      return newOptions;
    });
  };

  const [processes, setProcesses] = useState([]);
  const [socket, setSocket] = useState(null);
  const [pendingRetry, setPendingRetry] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(zoneViewer);
  const [zone, setZone] = useState(null);
  const [zoneDetails, setZoneDetails] = useState([]);
  const [spawns, setSpawns] = useState([]);
  const [selectedZone, setSelectedZone] = useState('airplane');
  const [character, setCharacter] = useState({});
  const [groupMembers, setGroupMembers] = useState([]);
  const [myTarget, setMyTarget] = useState('');
  const cameraControls = useRef();
  const retryRef = useRef(false);
  const zoneViewerRef = useRef(true);
  const { addToast } = useToasts();

  const doConnect = async () => {
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
    let newSocket;
    try {
      newSocket = await new Promise((res, rej) => {
        const socket = io(address, { secure: true });
        const timeout = setTimeout(() => {
          socket.disconnect();
          rej();
        }, 3000);
        socket.on('connect_failed', rej);
        socket.on('disconnect', rej);
        socket.on('error', rej);
        socket.on('connect', () => {
          clearTimeout(timeout);
          res(socket);
        });
      });
    } catch (e) {
      console.warn('Socket connection failed', e);
      addToast(`Could not connect to ${address}`, {
        appearance: 'error',
      });
      setSocket(null);
      return;
    }
    const validationInfo = await new Promise((res) =>
      newSocket.emit('validate', token, res),
    );
    if (validationInfo.validated) {
      addToast(`Successfully Connected to ${address}`, {
        appearance: 'info',
      });
    } else {
      addToast('Invalid or expired token supplied', {
        appearance: 'error',
      });
      newSocket.disconnect();
      return;
    }

    newSocket.on('activeProcesses', setProcesses);
    newSocket.on('setSpawns', (spawns) => {
      if (zoneViewerRef.current) {
        return;
      }
      setSpawns(spawns);
    });

    newSocket.on('spawn', (spawns) => {
      if (zoneViewerRef.current) {
        return;
      }
      spawns.forEach((spawn) => {
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
          { appearance: 'info' },
        );
      });
    });
    newSocket.on('despawn', (despawns) => {
      if (zoneViewerRef.current) {
        return;
      }
      despawns.forEach((spawn) => {
        addToast(`Mob Despawned: ${spawn.displayedName}`, {
          appearance: 'info',
        });
      });
    });
    newSocket.on('charInfo', ({ character, zone, groupMembers }) => {
      if (zoneViewerRef.current) {
        return;
      }
      setCharacter(character);
      setGroupMembers(groupMembers);
      setZone(zone);
    });
    newSocket.on('lostProcess', async (processId) => {
      if (zoneViewerRef.current) {
        return;
      }
      setSelectedProcess(null);
      setPendingRetry(true);
      let retries = 0;
      while (retries < 10 && retryRef.current === false) {
        await new Promise((res) => setTimeout(res, 3000));
        const newProcess = await new Promise((res) =>
          newSocket.emit('checkProcess', processId, res),
        );

        if (newProcess) {
          setSelectedProcess(newProcess);
          setProcesses((processes) =>
            processes.map((p) =>
              p.processId === newProcess.processId ? newProcess : p,
            ),
          );
          break;
        }
        retries++;
      }
      retryRef.current = false;
      setPendingRetry(false);
    });
    setSocket(newSocket);
    setConnectionOptionsOpen(false);
  };

  const handleRefreshProcess = useCallback(() => {
    if (!socket) {
      return;
    }
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
        ] ?? [],
      );
    })();
    if (!selectedProcess.zoneViewer) {
      socket.emit('selectProcess', selectedProcess.processId);
    }
  }, [selectedProcess, socket, selectedZone]);

  const filteredSpawns = useMemo(() => {
    return selectedProcess?.zoneViewer
      ? []
      : spawns.filter((s) => {
        let ret = Boolean(s);
        if (spawnFilter.length) {
          ret = ret && s?.displayedName?.includes?.(spawnFilter);
        }
        if (showNpcs) {
          ret = ret && showPcs ? [1, 0].includes(s.type) : s.type === 1;
        }
        if (showPcs) {
          ret = ret && showNpcs ? [1, 0].includes(s.type) : s.type === 0;
        }
        if (showGroup) {
        }
        return ret;
      });
  }, [selectedProcess, showNpcs, spawns, spawnFilter, showGroup, showPcs]);

  const zoneName = useMemo(
    () => (selectedProcess?.zoneViewer ? selectedZone : zone?.shortName),
    [selectedProcess, selectedZone, zone],
  );
  const isHooked = useMemo(() => !!selectedProcess?.zone?.shortName, [
    selectedProcess,
  ]);

  return (
    <Paper className="zone-container" elevation={1}>
      <Card className="zone-header" variant="outlined">
        <CardContent className="zone-header">
          <div className="btn-row">
            {processMode && (
              <Button
                sx={{ color: socket ? 'green' : 'white' }}
                variant="outlined"
                onClick={handleConnectionOptionsOpen}
              >
                {socket ? 'Connected' : 'Not Connected'}
              </Button>
            )}

            <Button variant="outlined" onClick={handleOptionsOpen}>
              Options
            </Button>

            {isHooked && (
              <>
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
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (zoneRef.current) {
                      zoneRef.current.followMe(!cameraFollowMe);
                      setOption('cameraFollowMe', !cameraFollowMe);
                    }
                  }}
                >
                  {cameraFollowMe ? 'Unfollow me' : 'Follow me'}
                </Button>
              </>
            )}
            {processMode && (
              <div style={{ maxWidth: 300, minWidth: 300 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    {pendingRetry ? 'Attempting Reconnect...' : 'Process'}
                  </InputLabel>
                  <Select
                    startAdornment={
                      <InputAdornment position="start">
                        <RefreshIcon
                          sx={{ cursor: 'pointer' }}
                          onClick={() => {
                            handleRefreshProcess();
                          }}
                        />
                      </InputAdornment>
                    }
                    sx={{ height: 40 }}
                    disabled={pendingRetry}
                    value={selectedProcess ?? ''}
                    label="Process"
                    displayEmpty
                    onChange={({ target: { value } }) =>
                      setSelectedProcess(value)
                    }
                  >
                    {processes.concat(zoneViewer).map((p) =>
                      p.zoneViewer ? (
                        <MenuItem value={p}>Zone Viewer</MenuItem>
                      ) : (
                        <MenuItem value={p}>
                          {p.zone.characterName} - {p.zone.longName}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>
              </div>
            )}

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
                id="combo-box-demo"
                options={supportedZoneOptions}
                sx={{ width: 300 }}
                size="small"
                renderInput={(params) => (
                  <TextField
                    sx={{ height: 38 }}
                    {...params}
                    label="Zone"
                    value={selectedZone}
                  />
                )}
              />
            )}
            {spawns.length ? (
              <>
                <TextField
                  size="small"
                  onChange={({ target: { value } }) => setSpawnFilter(value)}
                  label="Spawn Filter"
                  value={spawnFilter}
                />
                <InputLabel
                  style={{ marginLeft: 8 }}
                  id="demo-simple-select-label"
                >
                  Showing {filteredSpawns.length} of {spawns.length} Spawns
                </InputLabel>
                <Button variant="outlined" onClick={handleSearchOpen}>
                  Spawn Search
                </Button>
              </>
            ) : null}
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
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              Options
            </DialogTitle>
            <DialogContent>
              <div style={{ height: 400, width: '100%' }}>
                {isHooked && (
                  <>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Max Distance for Spawn Name: {maxTargetDisplay}
                    </Typography>
                    <Slider
                      value={maxTargetDisplay}
                      onChange={(e) =>
                        setOption('maxTargetDisplay', +e.target.value)
                      }
                      step={10}
                      min={0}
                      max={5000}
                    />
                  </>
                )}
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Max Distance for Points of Interest: {maxPoiDisplay}
                </Typography>
                <Slider
                  value={maxPoiDisplay}
                  onChange={(e) => setOption('maxPoiDisplay', +e.target.value)}
                  step={10}
                  min={0}
                  max={10000}
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
                  onChange={(e) => setOption('fontSize', +e.target.value)}
                  step={1}
                  min={5}
                  max={25}
                />
                <FormGroup>
                  {isHooked && (
                    <>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={showNpcs}
                            onChange={({ target: { checked } }) =>
                              setOption('showNpcs', checked)
                            }
                          />
                        }
                        label="Show NPCs"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={showPcs}
                            onChange={({ target: { checked } }) =>
                              setOption('showPcs', checked)
                            }
                          />
                        }
                        label="Show PCs"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={showGroup}
                            onChange={({ target: { checked } }) =>
                              setOption('showGroup', checked)
                            }
                          />
                        }
                        label="Show Group Members"
                      />
                    </>
                  )}

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showPoi}
                        onChange={({ target: { checked } }) =>
                          setOption('showPoi', checked)
                        }
                      />
                    }
                    label="Show points of interest"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showPoiLoc}
                        onChange={({ target: { checked } }) =>
                          setOption('showPoiLoc', checked)
                        }
                      />
                    }
                    label="Show points of interest location (YXZ)"
                  />
                </FormGroup>
                <FormControl sx={{ marginTop: 1 }} fullWidth>
                  <InputLabel id="demo-simple-select-label">Skybox</InputLabel>
                  <Select
                    disabled={pendingRetry}
                    value={skybox ?? ''}
                    label="Skybox"
                    displayEmpty
                    onChange={({ target: { value } }) =>
                      setOption('skybox', value)
                    }
                  >
                    {skyboxOptions.map((p) => (
                      <MenuItem value={p}>{p}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {isHooked && (
                  <div style={{ marginTop: 10 }}>
                    <InputLabel id="demo-simple-select-label">
                      Character Text Color
                    </InputLabel>
                    <ColorPicker
                      hideTextFIeld
                      value={charColor ?? '#FFFFFF'}
                      onChange={(color) => setOption('charColor', color)}
                    />
                    <InputLabel id="demo-simple-select-label">
                      Group Member Text Color
                    </InputLabel>
                    <ColorPicker
                      hideTextFIeld
                      value={groupColor ?? '#FFFFFF'}
                      onChange={(color) => setOption('groupColor', color)}
                    />
                  </div>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleOptionsClose}>
                Done
              </Button>
            </DialogActions>
          </Dialog>

          {/* Connection Dialog */}
          <Dialog
            open={connectionOptionsOpen}
            onClose={() => setConnectionOptionsOpen(false)}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              Connection
            </DialogTitle>
            <DialogContent>
              <div className="connection-content">
                <TextField
                  fullWidth
                  onChange={({ target: { value } }) =>
                    setOption('address', value)
                  }
                  label="Server Address"
                  placeholder="https://localhost:4500"
                  value={address}
                />
                <TextField
                  fullWidth
                  onChange={({ target: { value } }) =>
                    setOption('token', value)
                  }
                  label="Token"
                  placeholder=""
                  multiline
                  value={token}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={() => setConnectionOptionsOpen(false)}>
                Cancel
              </Button>
              <Button autoFocus onClick={doConnect}>
                Connect
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
                  spawns={filteredSpawns}
                  myTarget={selectedProcess?.zoneViewer ? null : myTarget}
                  setMyTarget={setMyTarget}
                  controls={cameraControls}
                  zoneName={zoneName}
                  canvasRef={canvasRef}
                  groupMembers={showGroup ? groupMembers : []}
                  {...options}
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
