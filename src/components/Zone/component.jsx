import React, {
  useState,
  useRef,
  Suspense,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import ReactDOM from 'react-dom';
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
import Draggable from 'react-draggable';

// Our data
import { mq } from '../../common/mq';
import { usePollValue } from '../../hooks/usePollValue';
import { useEffect } from 'react';
import { PylonBufferGeometry, worldToScreen } from './extensions';

import {
  Canvas,
  useLoader,
  useFrame,
  extend,
  useThree,
} from '@react-three/fiber';
import * as THREE from 'three';
import { useProgress, Html, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './component.scss';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Text } from 'troika-three-text';
import { Typography } from '@mui/material';



extend({
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
  Text,
  PylonBufferGeometry,
});

const storageUrl = 'https://mqbrowser.blob.core.windows.net/zones';


const images = ['right', 'left', 'top', 'bot', 'front', 'back'];

const getImagePaths = folder => images.map(img => `/bg/${folder}/${img}.png`);

const useSkybox = path => {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new THREE.CubeTextureLoader();
    const mat = loader.load(getImagePaths(path));
    scene.background = mat;
    scene.environment = mat;
  }, [path]); //eslint-disable-line

  return null;
};

const CameraControls = forwardRef(({ controls }, ref) => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame

  useFrame((state) => {
    state.camera.far = 100000;
    state.camera.near = 0.1;
    state.camera.updateProjectionMatrix();
    controls.current.update();
  });

  return <OrbitControls ref={ref} args={[camera, domElement]} />;
});

function Loader() {
  const { progress, loaded } = useProgress();
  return (
    <Html center>
      {loaded} Meshes Loaded {progress}% Loaded
    </Html>
  );
}

const RenderedZone = forwardRef(
  (
    { zoneName, controls, spawns = [], myTarget, canvasRef, maxTargetDisplay },
    forwardRef,
  ) => {
    const {
      camera,
      gl: { domElement },
    } = useThree();

    // Skybox
    useSkybox('space');

    const character = usePollValue(() => {
      const x = mq.tlo.Me.X();
      const y = mq.tlo.Me.Y();
      const z = mq.tlo.Me.Z();
      const level = mq.tlo.Me.Level();
      return { x, y, z, level };
    });
    const [originalTarget, setOriginalTarget] = useState(null);
    const [target, setTarget] = useState(myTarget);
    const [{ bannerScale, bannerLoc }, setBanner] = useState({
      bannerScale: 0,
      bannerLoc  : { x: 0, y: 0, z: 0 },
    });
    const spawnRef = useRef([]);
    const characterRef = useRef();
    
    const zoneTexture = useLoader(GLTFLoader, `${storageUrl}/${zoneName}.glb`);
    const bannerTexture = useLoader(
      GLTFLoader,
      `${storageUrl}/textures/banner.glb`,
    );
    const swordTexture = useLoader(
      GLTFLoader,
      `${storageUrl}/textures/sword2.glb`,
    );

    useFrame(() => {
      const ctx = canvasRef.current?.getContext?.('2d');
      if (!ctx) {
        return;
      }
      ctx.clearRect(0, 0, domElement.width, domElement.height);
      const frustum = new THREE.Frustum();
      frustum.setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse,
        ),
      );
      for (const spawn of spawnRef.current.filter(Boolean).filter(
        (s) =>
          frustum.containsPoint(s.position) &&
          camera.position.distanceTo(s.position) < maxTargetDisplay,
      )) {
        const screen = worldToScreen(canvasRef.current, spawn.position, camera);
        let side = 1;
        if (screen.x > canvasRef.current.width / 2) {
          side = -1;
        }
        ctx.strokeStyle = '#FFFFFF';

        ctx.beginPath();
        ctx.moveTo(screen.x, screen.y);
        ctx.lineTo(screen.x - side * 12, screen.y);
        ctx.lineTo(screen.x - side * 60, screen.y - 40);
        ctx.stroke();

        ctx.textAlign = 'start';
        if (side === -1) {
          ctx.textAlign = 'end';
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.font = spawn.isTarget ? 'bold 16px Arial' : '13px Arial';
        ctx.textAlign = 'center';
        const nameWidth = ctx.measureText(spawn.spawn.displayedName).width;

        ctx.fillText(
          spawn.spawn.displayedName,
          screen.x -
            side * 2 -
            side * nameWidth -
            side * 16 +
            (nameWidth * side) / 2,
          screen.y - 64 + 6,
        );

        ctx.fillStyle = '#FFFFFF';
        ctx.font = spawn.isTarget
          ? 'italic bold 13px Arial'
          : 'italic 11px Arial';
        const level = `Level ${spawn.spawn.level}`;

        ctx.fillText(
          level,
          screen.x -
            side * 2 -
            side * nameWidth -
            side * 16 +
            (nameWidth * side) / 2,
          screen.y - 44,
        );
      }
    });

    useEffect(() => {
      if (myTarget) {
        setTarget(myTarget);
        const associatedIndex = spawns.findIndex((s) => s.id === myTarget.id);
        const associatedTarget = spawnRef.current[associatedIndex];
        if (associatedTarget) {
          setTimeout(() => {
            const associatedTargetPosition = new THREE.Vector3(
              associatedTarget.position.x,
              associatedTarget.position.y,
              associatedTarget.position.z,
            );
            const lookPosition = new THREE.Vector3(
              associatedTargetPosition.x + 100,
              associatedTargetPosition.y + 500,
              associatedTargetPosition.z + 100,
            );
            camera.position.set(lookPosition.x, lookPosition.y, lookPosition.z);
            controls.current.target.copy(associatedTarget.position);
            camera.lookAt(associatedTargetPosition);
          }, 0);
        }
      }
    }, [myTarget]) //eslint-disable-line

    useEffect(() => {
      if (target?.id) {
        mq.tlo.Spawn(target?.id).DoTarget();
      }
    }, [target]);

    const targetMe = useCallback(() => {
      if (zoneTexture?.scene) {
        zoneTexture.scene.position.set(-40, 0, 0);
        setTimeout(() => {
          const charPosition = new THREE.Vector3(
            character.y * -1,
            character.z + 15,
            character.x,
          );
          const lookPosition = new THREE.Vector3(
            charPosition.x + 100,
            charPosition.y + 300,
            charPosition.z + 100,
          );
          camera.position.set(lookPosition.x, lookPosition.y, lookPosition.z);
          controls.current.target.copy(charPosition);
          camera.lookAt(charPosition);
        }, 0);
      }
    }, [zoneTexture]) //eslint-disable-line

    useEffect(() => {
      targetMe();
    }, [zoneTexture]) //eslint-disable-line

    // Update banner location when target changes or spawn changes
    useEffect(() => {
      const spawn = spawns.find((s) => s.id === target?.id);
      if (spawn) {
        setBanner({
          bannerScale: 6,
          bannerLoc  : { x: spawn.x, y: spawn.y, z: spawn.z },
        });
      } else {
        setBanner({ bannerScale: 0, bannerLoc: { x: 0, y: 0, z: 0 } });
      }
    }, [target, spawns]);

    //
    useEffect(() => {
      if (controls.current) {
        controls.current.reset();
      }
    }, [zoneName, controls]);

    useEffect(() => {
      spawnRef.current = spawnRef.current.slice(0, spawns.length);
    }, [spawns, camera.position]);

    const followMe = (doFollow) => {
      if (doFollow) {
        setOriginalTarget(controls.current.target);
        controls.current.target = characterRef.current.position; 
      } else {
        controls.current.target = originalTarget;
      }
    };

    // Expose functions to parent
    useImperativeHandle(forwardRef, () => ({
      targetMe,
      followMe
    }));

    return (
      <>
        {spawns.map((s, i) => {
          const isTarget = s.id === target?.id;
          const color =
            s.level - character.level > 3
              ? 'red'
              : s.level - character.level > 0
                ? 'yellow'
                : s.level - character.level > -3
                  ? 'blue'
                  : 'gray';
          return (
            <React.Fragment key={`spawn-${s.id}`}>
              {isTarget && (
                <spotLight
                  intensity={2.5}
                  angle={1.4}
                  penumbra={0.8}
                  color={color}
                  target={spawnRef.current[i]}
                  position={[s.y * -1, s.z + 65, s.x]}
                />
              )}
              <mesh
                ref={(el) => (spawnRef.current[i] = el)}
                spawn={s}
                isTarget={isTarget}
                onClick={() => {
                  setTarget(s);
                }}
                position={[s.y * -1, s.z + 15, s.x]}
              >
                <octahedronBufferGeometry args={[10]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </React.Fragment>
          );
        })}

        {/* Our character - sword model */}
        <primitive
          ref={characterRef}
          scale={[5, 5, 5]}
          rotation={[0, 0, 0.5]}
          position={[character.y * -1 - 3, character.z + 65, character.x + 4]}
          object={swordTexture?.scene}
        />
        {/* Spotlight over our head */}
        <spotLight
          intensity={2.5}
          angle={0.5}
          penumbra={0.8}
          color="white"
          target={characterRef.current}
          position={[character.y * -1, character.z + 145, character.x]}
        />
        {/* Banner for targeting */}
        <primitive
          scale={[bannerScale, bannerScale, bannerScale]}
          position={[
            bannerLoc.y * -1 - 85,
            bannerLoc.z + 120,
            bannerLoc.x - 143,
          ]}
          object={bannerTexture?.scene}
        />
        {/* Our zone */}
        <primitive object={zoneTexture?.scene} />
      </>
    );
  },
);

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

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

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
  const [cameraFollowMe, setCameraFollowMe] = useState(false);


  const selectedZone = usePollValue(() => mq.tlo.Zone.ShortName().toLowerCase(), 3000);
  const [nextDateUpdateCallback, setNextDataUpdateCallback] = useState(null);
  const spawns = usePollValue(() => {
    return mq
      .getZoneSpawns()
      .filter(Boolean)
      .filter((s) => s?.displayedName !== mq.tlo.Me.DisplayName());
  }, 1000);
  const [filteredSpawns, setFilteredSpawns] = useState(spawns);
  const [myTarget, setMyTarget] = useState('');
  const cameraControls = useRef();

  useEffect(() => {
    setTimeout(() => {
      setFilteredSpawns(mq
        .getZoneSpawns()
        .filter(Boolean)
        .filter((s) => s?.displayedName !== mq.tlo.Me.DisplayName()));
    }, 2000);
    
  }, [selectedZone]); // eslint-disable-line

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
                  aria-label="Temperature"
                  value={maxTargetDisplay}
                  onChange={(e) => setMaxTargetDisplay(+e.target.value)}
                  step={10}
                  min={0}
                  max={3000}
                />
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
            {selectedZone && (
              <Suspense fallback={<Loader />}>
                <RenderedZone
                  ref={zoneRef}
                  maxTargetDisplay={maxTargetDisplay}
                  spawns={filteredSpawns.filter(Boolean)}
                  myTarget={myTarget}
                  setMyTarget={setMyTarget}
                  controls={cameraControls}
                  zoneName={selectedZone}
                  canvasRef={canvasRef}
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
