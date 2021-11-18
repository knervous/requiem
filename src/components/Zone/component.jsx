import React, {
  useState,
  useRef,
  Suspense,
  forwardRef,
  useCallback,
} from 'react';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Our data
import { mq } from '../../common/mq';
import { usePollValue } from '../../hooks/usePollValue';
import { useEffect } from 'react';

import {
  Canvas,
  useLoader,
  useFrame,
  extend,
  useThree,
} from '@react-three/fiber';

import { useProgress, Html, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './component.scss';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Text } from 'troika-three-text';

extend({ EffectComposer, RenderPass, UnrealBloomPass, Text });

const labelTextOptions = {
  font         : 'Philosopher',
  fontSize     : 12,
  color        : 'white',
  maxWidth     : 300,
  lineHeight   : 1,
  letterSpacing: 0,
  textAlign    : 'justify',
  materialType : 'MeshPhongMaterial',
};

const storageUrl = 'https://mqbrowser.blob.core.windows.net/zones';

// function SkyBox() {
//   const renderer = useThree();
//   const texture = useLoader(
//     THREE.TextureLoader,
//     `sky4.jpg`
//   );
//   const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
//   rt.fromEquirectangularTexture(renderer, texture);
//   // Set the scene background property to the resulting texture.
//   renderer.scene.background = rt.texture
//   return null;
// }

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

const RenderedZone = ({
  zoneName,
  controls,
  setMyTarget,
  spawns = [],
  myTarget,
}) => {
  const { camera } = useThree();
  const character = usePollValue(() => {
    const x = mq.tlo.Me.X() || 0;
    const y = mq.tlo.Me.Y() || 0;
    const z = mq.tlo.Me.Z() || 0;
    const level = mq.tlo.Me.Level() || 7;
    return { x, y, z, level };
  });
  const [target, setTarget] = useState(myTarget);
  const [{ bannerScale, bannerLoc }, setBanner] = useState({
    bannerScale: 0,
    bannerLoc  : { x: 0, y: 0, z: 0 },
  });
  const textRef = useRef([]);
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
  useEffect(() => {
    if (myTarget) {
      setTarget(myTarget);
      const associatedIndex = spawns.findIndex(s => s.id === myTarget.id);
      const associatedTarget = spawnRef.current[associatedIndex];
      if (associatedTarget) {
        camera.position.set(associatedTarget.position.x + 200, associatedTarget.position.y + 200, associatedTarget.position.z + 200);
        setTimeout(() => {
          controls.current.target.copy(associatedTarget.position);
          camera.lookAt(associatedTarget.position);
        }, 100);
      }

    }
    
  }, [myTarget]); //eslint-disable-line
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
    textRef.current = textRef.current.slice(0, spawns.length);
    spawnRef.current = spawnRef.current.slice(0, spawns.length);
    for (const textItem of textRef.current) {
      textItem.lookAt(camera.position);
    }
  }, [spawns, camera.position]);

  if (zoneTexture?.scene) {
    zoneTexture.scene.position.set(-40, 0, 0);
  }

  return (
    <>
      {spawns.map((s, i) => {
        const displayText = `${s.displayedName} - Level ${s.level}`;
        const isTarget = s.id === target?.id;
        const targetedOptions = isTarget ? { color: 'yellow' } : {};
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
            <text
              ref={(el) => (textRef.current[i] = el)}
              anchorX="center"
              anchorY="center"
              anchorZ="center"
              {...labelTextOptions}
              {...targetedOptions}
              text={displayText}
              position={[s.y * -1, s.z + 45, s.x]}
            />
            {isTarget && (
              <spotLight
                intensity={2.5}
                angle={1.4}
                penumbra={0.8}
                color={color}
                target={textRef.current[i]}
                position={[s.y * -1, s.z + 65, s.x]}
              />
            )}
            <mesh
              ref={(el) => (spawnRef.current[i] = el)}
              onClick={() => {
                setMyTarget(`${s.displayedName} - Level ${s.level}`);
                setTarget(s);
              }}
              position={[s.y * -1, s.z + 15, s.x]}
            >
              <sphereBufferGeometry args={[9, 32, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </React.Fragment>
        );
      })}

      {/* Our character */}
      <mesh
        onClick={() => {}}
        ref={characterRef}
        position={[character.y * -1, character.z + 15, character.x]}
      >
        <sphereBufferGeometry args={[9, 32, 32]} />
        <meshStandardMaterial color={'hotpink'} />
      </mesh>
      {/* Our overhead sword */}
      <primitive
        scale={[5, 5, 5]}
        rotation={[0, 0, 0.5]}
        position={[character.y * -1 - 3, character.z + 145, character.x + 4]}
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
        position={[bannerLoc.y * -1 - 85, bannerLoc.z + 120, bannerLoc.x - 143]}
        object={bannerTexture?.scene}
      />
      {/* Our zone */}
      <primitive object={zoneTexture?.scene} />
    </>
  );
};

const spawnColumns = [
  { field: 'displayedName', headerName: 'Name', width: 200, resizable: true },
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
  const [selectedZone] = useState(mq.tlo.Zone.ShortName()?.toLowerCase() ?? 'qeytoqrg');
  const [nextDateUpdateCallback, setNextDataUpdateCallback] = useState(null);
  const spawns = usePollValue(() => {
    return mq
      .getZoneSpawns()
      .filter((s) => s.displayedName !== mq.tlo.Me.DisplayName());
  }, 500);
  const [filteredSpawns, setFilteredSpawns] = useState(spawns);
  const [myTarget, setMyTarget] = useState('');
  const cameraControls = useRef();

  const onFilterModelChange = useCallback(
    ({ items }) => {
      if (!items.every((i) => i.value === undefined)) {
        setNextDataUpdateCallback(() => ({ filter: { visibleRowsLookup } }) => {
          setFilteredSpawns(
            Object.entries(visibleRowsLookup)
              .filter(([_, visible]) => visible)
              .map(([visibleRow]) => spawns.find((s) => +s.id === +visibleRow)),
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
    setFilteredSpawns(filteredSpawns => filteredSpawns.map(f => spawns.find(s => s.id === f.id)));
  }, [spawns, setFilteredSpawns]);

  return (
    <Paper className="zone-container" elevation={1}>
      <Card className="zone-header" variant="outlined">
        <CardContent className="zone-header">
          <Accordion className="zone-accordion">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Spawn Search and Filter</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ height: 300, width: '100%' }}>
                <DataGrid
                  onRowClick={(row) => {
                    setMyTarget(row.row);
                  }}
                  onFilterModelChange={onFilterModelChange}
                  onStateChange={nextDateUpdateCallback}
                  ref={dataGridRef}
                  columns={spawnColumns}
                  rows={spawns}
                  components={{
                    Toolbar: GridToolbar,
                  }}
                />
              </div>
            </AccordionDetails>
          </Accordion>
          <Canvas>
            {/* <SkyBox /> */}
            <CameraControls controls={cameraControls} ref={cameraControls} />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {selectedZone && (
              <Suspense fallback={<Loader />}>
                <RenderedZone
                  spawns={filteredSpawns}
                  myTarget={myTarget}
                  setMyTarget={setMyTarget}
                  controls={cameraControls}
                  zoneName={selectedZone}
                />
              </Suspense>
            )}
          </Canvas>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Paper>
  );
};
