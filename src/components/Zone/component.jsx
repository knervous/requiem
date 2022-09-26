import React, {
  useState,
  useRef,
  Suspense,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import ReactDOM from 'react-dom';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
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
  FormControl,
  Autocomplete,
  TextField,
  InputAdornment,
  Typography,
  Slider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import { Canvas } from '@react-three/fiber';

import { CameraControls } from './camera-controls';
import { RenderedZone, PaperComponent } from './rendered-zone';
import { Loader } from './loader';
import './component.scss';
import { useMemo } from 'react';
import { useToasts } from 'react-toast-notifications';
import { SocketHandler } from './socketHandler';
import { SettingsContext } from '../Context/settings';
import supportedZones from './supportedZones';
import { ConnectionDialog } from './connection';

const processMode =
  new URLSearchParams(window.location.search).get('mode') === 'process';

let initialZone = new URLSearchParams(window.location.search).get('zone');
if (!supportedZones.some(({ shortName }) => shortName === initialZone)) {
  initialZone = 'airplane';
}
const supportedZoneOptions = supportedZones.map(
  ({ shortName, longName }, id) => ({
    label: `${longName} (${shortName})`,
    shortName,
    id,
  }),
);
// https://192.168.2.102:4500

const spawnColumns = [
  { field: 'displayedName', headerName: 'Name', width: 200 },
  { field: 'level', headerName: 'Level', type: 'number', width: 100 },
  {
    field      : 'type',
    headerName : 'Player Type',
    width      : 150,
    sortable   : false,
    valueGetter: (params) =>
      params.row.spawnType === 0
        ? 'PC'
        : params.row.spawnType === 1
          ? 'NPC'
          : 'Corpse',
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

  // Options
  const [spawnFilter, setSpawnFilter] = useState('');
  const [staticSpawnFilter, setStaticSpawnFilter] = useState('');
  const [poiFilter, setPoiFilter] = useState('');
  const options = useContext(SettingsContext);
  const {
    cameraFollowMe,
    showNpcs,
    showGroup,
    showPcs,
    showPoi,
    showStaticSpawns = true,
    showStaticSpawnFilter = true,
    follow = false,
    followTel = false,
    address,
    showPoiFilter,
    cameraType,
    flySpeed,
    setOption,
    autoConnect,
    version,
    token
  } = options;

  const [processes, setProcesses] = useState([]);
  const [socket, setSocket] = useState(null);
  const [pendingRetry, setPendingRetry] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(zoneViewer);
  const [zone, setZone] = useState(null);
  const [zoneDetails, setZoneDetails] = useState([]);
  const [spawns, setSpawns] = useState([]);
  const [staticSpawns, setStaticSpawns] = useState([]);
  const [selectedZone, setSelectedZone] = useState(initialZone);
  const [character, setCharacter] = useState(null);
  const [parseInfo, setParseInfo] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [myTarget, setMyTarget] = useState('');
  const cameraControls = useRef();
  const retryRef = useRef(false);
  const zoneViewerRef = useRef(true);
  const { addToast } = useToasts();

  const getOffsets = useCallback(async () => {
    let offsets;
    switch (version) {
      default:
      case 'live':
      {
        const [eqgame, playerclient, pcClient, everquest, globals] = await Promise.all([
          'eqgame', 'PlayerClient', 'PcClient', 'EverQuest', 'Globals'].map(header => fetch(`https://raw.githubusercontent.com/macroquest/eqlib/live/${header}.h`).then(t => t.text())));
        offsets = (await import('./offsets/live')).extractLive(eqgame, playerclient, pcClient, everquest, globals);
        break;
      }
         
      case 'titanium':
      {
        const { p99Offsets } = await import('./offsets/p99');
        offsets = p99Offsets;
        break;
      }
    }
    return offsets;
  }, [version]);
  const doConnect = async () => {
    if (socket) {
      socket.close();
    }
    setSocket(null);
    let newSocket;
    try {
      newSocket = new SocketHandler(address, addToast);
      await newSocket.connected;
      setOption('autoConnect', true);
    } catch (e) {
      console.warn('Socket connection failed', e);
      addToast(`Could not connect to ${address}`, {
        appearance: 'error',
      });
      setSocket(null);
      return;
    }



    if (processMode) {
      const validationInfo = await new Promise((res) =>
        newSocket.emit('validate', token, res),
      );
      if (validationInfo.IsValidated) {
        addToast(<div>Successfully Connected to {address}<br/>
        Features enabled: {validationInfo.Features.join(', ')}<br/>
        Days Remaining: {validationInfo.DaysRemaining}</div>, {
          appearance: 'info'
        });
      } else {
        addToast('Invalid or expired token supplied', {
          appearance: 'error',
        });
        newSocket.disconnect();
        return;
      }
      

      newSocket.emit('refreshProcesses', await getOffsets());
   

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
      newSocket.on('charInfo', ({ character, zoneInfo, groupMembers }) => {
        if (zoneViewerRef.current) {
          return;
        }
        setCharacter(character);
        setGroupMembers(groupMembers);
        setZone(zoneInfo);
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
              processes.map((p) => (p.pid === newProcess.pid ? newProcess : p)),
            );
            break;
          }
          retries++;
        }
        retryRef.current = false;
        setPendingRetry(false);
      });
    } else {
      addToast(`Successfully Connected to ${address}`, {
        appearance: 'info',
      });
      
      newSocket.emit('startParse');

      newSocket.on('parseInfo', (parseInfo) => {
        setSelectedZone(
          supportedZones.find((z) => z.longName === parseInfo.zoneName).shortName,
        );
        setParseInfo(parseInfo);
      });
    }


    setSocket(newSocket);
    setConnectionOptionsOpen(false);
  };

  const doDisconnect = () => {
    if (socket) {
      socket.close();
    }
    setParseInfo(null);
    setSocket(null);
  };
  const handleRefreshProcess = useCallback(async () => {
    if (!socket) {
      return;
    }
    socket?.emit?.('refreshProcesses', await getOffsets());
    setPendingRetry(false);
    retryRef.current = true;
  }, [socket, getOffsets]);

  const filteredSpawns = useMemo(() => {
    return selectedProcess?.zoneViewer
      ? []
      : spawns.filter((s) => {
        let ret = Boolean(s) && character?.name !== s?.name;
        if (spawnFilter.length) {
          ret = s?.displayedName
            ?.toLowerCase()
            ?.includes?.(spawnFilter.toLowerCase());
        }
        if (showNpcs) {
          ret =
              ret &&
              (showPcs ? [1, 0].includes(s.spawnType) : s.spawnType === 1);
        }
        if (showPcs) {
          ret =
              ret &&
              (showNpcs ? [1, 0].includes(s.spawnType) : s.spawnType === 0);
        }
        return ret;
      });
  }, [selectedProcess, showNpcs, spawns, spawnFilter, showPcs, character]);

  const filteredZoneDetails = useMemo(() => {
    if (!showPoi) {
      return [];
    }
    if (!showPoiFilter || !poiFilter.length) {
      return zoneDetails;
    }
    return zoneDetails.filter((z) =>
      z.description.toLowerCase().includes(poiFilter.toLowerCase()),
    );
  }, [poiFilter, showPoiFilter, zoneDetails, showPoi]);

  const filteredStaticSpawns = useMemo(() => {
    if (!showStaticSpawns) {
      return [];
    }
    return staticSpawnFilter.length
      ? staticSpawns.filter((sg) =>
        sg.some((entry) =>
          entry.name.toLowerCase().includes(staticSpawnFilter.toLowerCase()),
        ),
      )
      : staticSpawns;
  }, [showStaticSpawns, staticSpawns, staticSpawnFilter]);

  const zoneName = useMemo(
    () =>
      selectedProcess?.zoneViewer
        ? selectedZone
        : zone?.shortName ?? selectedProcess?.shortName,
    [selectedProcess, selectedZone, zone],
  );
  const isHooked = useMemo(() => !!selectedProcess?.shortName, [
    selectedProcess,
  ]);
  useEffect(() => {
    const prevOption = cameraFollowMe;
    setOption('follow', false);
    setOption('followTel', false);
    if (prevOption) {
      setTimeout(() => {
        setOption('follow', true);
      }, 500);
    }
    
  }, [zoneName]) // eslint-disable-line
  useEffect(() => {
    if (!selectedProcess) {
      return;
    }
    if (selectedProcess.zoneViewer) {
      zoneViewerRef.current = true;
      setZoneDetails([]);
      setStaticSpawnFilter('');
      setStaticSpawns([]);
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
          selectedProcess.zoneViewer ? selectedZone : selectedProcess.shortName
        ] ?? [],
      );

      try {
        const zoneStaticSpawns = await fetch(
          `/zones/${zoneName}.json`,
        ).then((r) => r.json());
        setStaticSpawns(zoneStaticSpawns);
      } catch {}
    })();
    if (!selectedProcess.zoneViewer) {
      socket?.emit?.('selectProcess', selectedProcess.pid);
      window.socketAction = (type, payload) => {
        socket.emit('doAction', {
          processId: selectedProcess.pid,
          payload,
          type,
        });
      };
    }
  }, [selectedProcess, socket, selectedZone, zoneName]);
  

  useEffect(() => {
    if (socket || !autoConnect) {
      return;
    }
    doConnect();
  }, []) // eslint-disable-line

  const doTarget = useCallback(
    (id) => {
      if (!socket || !selectedProcess?.pid) {
        return;
      }
      socket.emit('doAction', {
        processId: selectedProcess.pid,
        payload  : { id },
        type     : 'target',
      });
    },
    [socket, selectedProcess],
  );
  return (
    <Paper className="zone-container" elevation={1}>
      <Card className="zone-header" variant="outlined">
        <CardContent className="zone-header">
          <div className="zone-header">
            <div className="btn-row">
              {
                <Button
                  sx={{
                    color          : 'black',
                    backgroundColor: socket ? 'lightgreen' : 'white',
                  }}
                  variant="outlined"
                  onClick={handleConnectionOptionsOpen}
                >
                  {socket ? 'Connected' : 'Connect EQ'}
                </Button>
              }

              <div className="overlay-buttons">
                {socket && (character || parseInfo) && (
                  <>
                    <Button
                      sx={{ color: 'black', background: 'skyblue' }}
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
                      sx={{ color: 'black', background: 'skyblue' }}
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
                {/* <Button
                  sx={{ color: 'white', background: 'skyblue' }}
                  variant="outlined"
                  onClick={() => {
                    if (zoneRef.current) {
                      zoneRef.current.doTel(true);
                    }
                    setTimeout(() => {
                      if (document.activeElement) {
                        document.activeElement.blur();
                      }
                    }, 100);
                  }}
                >
                  {'Cam Tel'} */}
                {/* </Button> */}
                {isHooked && (
                  <Button
                    sx={{
                      color     : 'black',
                      background: follow ? 'lightgreen' : 'skyblue',
                    }}
                    variant="outlined"
                    onClick={() => {
                      socket.emit('doAction', {
                        processId: selectedProcess.pid,
                        payload  : { gravity: !followTel ? 0.0 : 0.4 },
                        type     : 'grav',
                      });
                      setOption('followTel', !followTel);
                      setTimeout(() => {
                        if (document.activeElement) {
                          document.activeElement.blur();
                        }
                      }, 100);
                    }}
                  >
                    {followTel ? 'Unfollow Tel' : 'Follow Tel'}
                  </Button>
                )}
                {/* </Button> */}
                
              </div>
              <div className="overlay-buttons" style={{ marginTop: 40 }}>
                {isHooked && character && (
                  <FormControl sx={{ marginTop: 1, width: 120 }}>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                    Run Speed: {character?.runSpeed}
                    </Typography>
                    <Slider
                      value={character?.runSpeed}
                      onChange={({ target: { value } }) => {
                        socket.emit('doAction', {
                          processId: selectedProcess.pid,
                          payload  : { speed: value },
                          type     : 'speed',
                        });
                      }}
                      step={0.1}
                      min={0}
                      max={1.3}
                    />
                  </FormControl>
                )}

              </div>
              <div className="overlay-buttons" style={{ marginTop: 100 }}>
                {isHooked && character && (<FormControlLabel
                  control={
                    <Checkbox
                      checked={character?.levitating}
                      onChange={({ target: { checked } }) => {
                        socket.emit('doAction', {
                          processId: selectedProcess.pid,
                          payload  : { lev: checked },
                          type     : 'lev',
                        });
                      }}
                    />
                  }
                  label="Levitate"
                />)}
              </div>
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
                      {processes.concat(zoneViewer).map((p, i) =>
                        p.zoneViewer ? (
                          <MenuItem key="zv" value={p}>
                            Zone Viewer
                          </MenuItem>
                        ) : (
                          <MenuItem key={`process${i}`} value={p}>
                            {p.characterName} - {p.longName}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </FormControl>
                </div>
              )}

              {selectedProcess?.zoneViewer && (
                <Autocomplete
                  value={
                    supportedZoneOptions.find(
                      (o) => o.shortName === selectedZone,
                    )?.label
                  }
                  isOptionEqualToValue={(a) => a}
                  blurOnSelect
                  disablePortal
                  onChange={(e_, { shortName } = {}) => {
                    if (shortName) {
                      setSelectedZone(null);
                      setTimeout(() => {
                        setSelectedZone(shortName);
                      }, 1);
                    }
                  }}
                  id="combo-box-demo"
                  options={supportedZoneOptions}
                  sx={{ width: 300 }}
                  size="small"
                  renderInput={(params) => (
                    <TextField sx={{ height: 38 }} {...params} label="Zone" />
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
              {showPoiFilter && showPoi ? (
                <TextField
                  size="small"
                  onChange={({ target: { value } }) => setPoiFilter(value)}
                  label="Marker Filter"
                  value={poiFilter}
                />
              ) : null}
              {staticSpawns.length && showStaticSpawnFilter ? (
                <>
                  <TextField
                    size="small"
                    onChange={({ target: { value } }) =>
                      setStaticSpawnFilter(value)
                    }
                    label="Spawn Filter"
                    value={staticSpawnFilter}
                  />
                  <InputLabel
                    style={{ marginLeft: 8 }}
                    id="demo-simple-select-label"
                  >
                    Showing {filteredStaticSpawns.length} of{' '}
                    {staticSpawns.length} Static Spawns
                  </InputLabel>
                </>
              ) : null}
            </div>

            {/* Search Dialog */}
            <Dialog
              maxWidth='lg'
              open={searchOpen}
              onClose={handleSearchClose}
              PaperComponent={PaperComponent}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle
                style={{ cursor: 'move' }}
                id="draggable-dialog-title"
              >
                Spawn Search and Filter
              </DialogTitle>
              <DialogContent>
                <div style={{ height: 600 }}>
                  <DataGrid
                    onRowClick={({ row }) => {
                      setMyTarget(row);
                      doTarget(row.id);
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

            {/* Connection Dialog */}
            <ConnectionDialog
              connectionOptionsOpen={connectionOptionsOpen}
              setConnectionOptionsOpen={setConnectionOptionsOpen}
              PaperComponent={PaperComponent}
              doConnect={doConnect}
              doDisconnect={doDisconnect}
              connected={!!socket}
            />
            <Canvas ref={threeRef}>
              {/* <SkyBox /> */}
              <CameraControls
                controls={cameraControls}
                type={cameraType}
                flySpeed={flySpeed}
                ref={cameraControls}
              />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              {selectedProcess && zoneName && (
                <Suspense fallback={<Loader />}>
                  <RenderedZone
                    socket={socket}
                    parseInfo={parseInfo}
                    zoneDetails={filteredZoneDetails}
                    character={selectedProcess?.zoneViewer ? null : character}
                    ref={zoneRef}
                    spawns={filteredSpawns}
                    staticSpawns={filteredStaticSpawns}
                    myTarget={selectedProcess?.zoneViewer ? null : myTarget}
                    setMyTarget={setMyTarget}
                    controls={cameraControls}
                    zoneName={zoneName}
                    canvasRef={canvasRef}
                    doTarget={doTarget}
                    groupMembers={showGroup ? groupMembers : []}
                    selectedProcess={selectedProcess}
                    options={options}
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
          </div>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Paper>
  );
};
