import React, { useState, useRef, Suspense } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AutoComplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// Our data
import { supportedZones } from './data';

import { mq } from '../../common/mq';
import { Button, } from '@mui/material';
import { useEffect } from 'react';

import {
  Canvas,
  useLoader,
  useFrame,
  extend,
  useThree,
} from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './component.scss';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({ OrbitControls });

const supportedZoneOptions = supportedZones.map((zone, id) => ({
  label: zone,
  id,
}));
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

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame((state) => {
    state.camera.far = 100000;
    state.camera.near = 0.1;
    state.camera.updateProjectionMatrix();
    controls.current.update();
  });
  return <orbitControls ref={controls} args={[camera, domElement]} />;
};

const RenderedZone = ({ zoneName }) => {
  const [objects, setObjects] = useState([]);
  const zoneGltf = useLoader(
    GLTFLoader,
    `${storageUrl}/${zoneName}/${zoneName}.glb`
  );
  useState(() => {
    console.log('Change zone name', zoneName);
    setObjects([]);
    // fetch(`${storageUrl}/${zoneName}/objects.json`)
    //   .then((r) => r.json())
    //   .then(async (objectMetadata) => {
    //     console.log('Got object metadata');

    //     const gLoader = new GLTFLoader();
    //     const zoneObjects = await Promise.all(
    //       Object.keys(objectMetadata)
    //         .filter(Boolean)
    //         .flatMap(async (key) => {
    //           const glb = await gLoader.loadAsync(
    //             `${storageUrl}/${zoneName}/${key}.glb`
    //           );
      
    //           const zoneObjects = [];
    //           for (const {
    //             posX,
    //             posY,
    //             posZ,
    //             rotX,
    //             rotY,
    //             rotZ,
    //             scaleX,
    //             scaleY,
    //             scaleZ,
    //           } of objectMetadata[key]) {
    //             const clone = glb.scene.clone();
    //             clone.position.set(posX, posY, posZ * -1);
    //             zoneObjects.push(clone);
    //           }
    //           return zoneObjects;
    //         })
    //     );
    //     setObjects(zoneObjects.flat());
    //   })
    //   .catch((e) => {
    //     console.warn('Error getting metadata', e);
    //   });
  }, [zoneName]);


  if (zoneGltf?.scene) {
    zoneGltf.scene.position.set(0, -20, -100);
    zoneGltf.scene.rotation.y = Math.PI;
  }
  return (
    <>
      <primitive object={zoneGltf?.scene ?? null} />
      {objects.map((obj) => <primitive key={obj.uuid} object={obj} />)}
    </>
  );
};

export const Zone = () => {
  const [selectedZone, setSelectedZone] = useState('qeynos2');
  useEffect(() => {}, []);

  return (
    <Box className="zone-container" sx={{ minWidth: 275 }}>
      <Card className="zone-header" variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Zone Viewer: {selectedZone}
          </Typography>
          <Button onClick={() => {
            const zoneName = mq.tlo.Zone.ShortName().toLowerCase();
            // if (supportedZones.includes(zoneName)) {
            setSelectedZone(zoneName);
            // }
            
          }}>Use my zone</Button>
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
            renderInput={(params) => <TextField {...params} label="Zone" value={selectedZone} />}
          />
        </CardContent>
        <CardActions></CardActions>
      </Card>
      <Card className="zone-card" variant="outlined">
        <CardContent>
          <Canvas>
            {/* <SkyBox /> */}
            <CameraControls />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {selectedZone && (
              <Suspense fallback={null}>
                <RenderedZone zoneName={selectedZone} />
              </Suspense>
            )}
          </Canvas>
        </CardContent>
        <CardActions>
         
        </CardActions>
      </Card>
    </Box>
  );
};
