import React, { useState, useRef, Suspense, forwardRef, useEffect } from 'react';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AutoComplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// Our data
import { supportedZones } from './data';
import * as THREE from 'three';
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
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Text } from 'troika-three-text';

extend({ EffectComposer, RenderPass, UnrealBloomPass, Text });

const supportedZoneOptions = supportedZones.map((zone, id) => ({
  label: zone,
  id,
}));
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

  const {
    camera,
    gl: { domElement },
  } = useThree();

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
}) => {

  const zoneTexture = useLoader(GLTFLoader, `${storageUrl}/${zoneName}.glb`);
  useSkybox('space');

  //
  useEffect(() => {
    if (controls.current) {
      controls.current.reset();
    }
  }, [zoneName, controls]);

  if (zoneTexture?.scene) {
    zoneTexture.scene.position.set(-40, 0, 0);
  }

  return (
    <primitive object={zoneTexture?.scene} />
  );
};

export const ZoneViewer = () => {
  const [selectedZone, setSelectedZone] = useState('qeytoqrg');

  const cameraControls = useRef();

  return (
    <Paper className="zone-container" elevation={1}>
      <Card className="zone-header" variant="outlined">
        <CardContent className="zone-header">
          <Typography
            sx={{ fontSize: 14 }}
            color="text.secondary"
            gutterBottom
          >
              Zone Viewer: {selectedZone}
          </Typography>
          <AutoComplete
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
            renderInput={(params) => (
              <TextField {...params} label="Zone" value={selectedZone} />
            )}
          />
          <Canvas>
            {/* <SkyBox /> */}
            <CameraControls controls={cameraControls} ref={cameraControls} />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {selectedZone && (
              <Suspense fallback={<Loader />}>
                <RenderedZone
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
