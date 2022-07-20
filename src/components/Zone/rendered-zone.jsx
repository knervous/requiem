import React, {
  useState,
  useRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';
  

import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
  
// Our data
import { mq } from '../../common/mq';
import { useEffect } from 'react';
import { PylonBufferGeometry, worldToScreen } from './extensions';
  
import {
  useLoader,
  useFrame,
  extend,
  useThree,
} from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './component.scss';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Text } from 'troika-three-text';
  
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
  
export const RenderedZone = forwardRef(
  (
    { zoneName, zoneDetails, controls, character, spawns = [], myTarget, canvasRef, maxTargetDisplay, fontSize },
    forwardRef,
  ) => {
    const {
      camera,
      gl: { domElement },
    } = useThree();
  
    // Skybox
    useSkybox('space');
  
    const [originalTarget, setOriginalTarget] = useState(null);
    const [target, setTarget] = useState(myTarget);
    const [{ bannerScale, bannerLoc }, setBanner] = useState({
      bannerScale: 0,
      bannerLoc  : { x: 0, y: 0, z: 0 },
    });
    const spawnRef = useRef([]);
    const zoneDetailsRef = useRef([]);
    const characterRef = useRef();
      
    const zoneTexture = useLoader(GLTFLoader, `${storageUrl}/${zoneName}.glb`);
    const bannerTexture = useLoader(
      GLTFLoader,
        `${storageUrl}/textures/banner.glb`,
    );
    const bamTexture = useLoader(
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
        ctx.font = spawn.isTarget ? `italic bold ${fontSize + 3}px Arial` : `italic ${fontSize}px Arial`;
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
          ? `italic bold ${fontSize + 3}px Arial`
          : `italic ${fontSize}px Arial`;
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

      for (const zoneDetail of zoneDetailsRef.current.filter(Boolean)) {
        const screen = worldToScreen(canvasRef.current, zoneDetail.position, camera);
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
        ctx.font = `italic bold ${fontSize + 3}px Arial`;
        ctx.textAlign = 'center';
        const nameWidth = ctx.measureText(zoneDetail.zoneDetail.description).width;
  
        ctx.fillText(
          zoneDetail.zoneDetail.description,
          screen.x -
              side * 2 -
              side * nameWidth -
              side * 16 +
              (nameWidth * side) / 2,
          screen.y - 64 + 6,
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
        zoneTexture.scene.position.set(0, 0, 0);
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
      }, [zoneTexture, character]) //eslint-disable-line
  
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
    window.rr = characterRef.current;
    // Expose functions to parent
    useImperativeHandle(forwardRef, () => ({
      targetMe,
      followMe
    }));
  
    return (
      <>
        {/** Spawns */}
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
        {zoneDetails.map((zoneDetail, i) => {
          return (
            <React.Fragment key={`zdetail-${zoneDetail.x}-${zoneDetail.y}-${zoneDetail.z}`}>
              <spotLight
                intensity={1.5}
                angle={1.4}
                penumbra={0.8}
                color="white"
                target={zoneDetailsRef.current[i]}
                position={[zoneDetail.y * -1, zoneDetail.z + 65, zoneDetail.x]}
              />
              <mesh
                ref={(el) => (zoneDetailsRef.current[i] = el)}
                zoneDetail={zoneDetail}
                position={[zoneDetail.y * -1, zoneDetail.z + 15, zoneDetail.x]}
              >
                <octahedronBufferGeometry args={[1]} />
                <meshStandardMaterial color="gray" />
              </mesh>
            </React.Fragment>
          );
        })}
  
        {/* Our character - sword model */}
        <primitive
          ref={characterRef}
          scale={[4, 4, 4]}
          rotation={[0.66, 1.6, -0.2]}
          position={[character.y * -1 - 3, character.z + 50, character.x + 4]}
          object={bamTexture?.scene}
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

  
export function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}