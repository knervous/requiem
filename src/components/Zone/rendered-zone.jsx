import React, {
  useState,
  useRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  Suspense,
} from 'react';

import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

// Our data
import { useEffect } from 'react';
import { PylonBufferGeometry, worldToScreen } from './extensions';

import { useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './component.scss';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Text } from 'troika-three-text';
import { useThrottledCallback } from 'use-debounce';
import { RenderedSpawn } from './rendered-spawn';

import { LineMaterial } from '../Common/LineMaterial';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { Item } from './item';
import { useCachedTexture } from '../Ui/hooks/useCachedTexture';

extend({
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
  Text,
  PylonBufferGeometry,
  LineMaterial,
  LineGeometry,
  Line2,
});

const processMode =
  new URLSearchParams(window.location.search).get('mode') === 'process';

const storageUrl = 'https://mqbrowser.blob.core.windows.net/zones';
const images = ['right', 'left', 'top', 'bot', 'front', 'back'];

const getImagePaths = (folder) =>
  images.map((img) => `/bg/${folder}/${img}.png`);

const useSkybox = (path) => {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new THREE.CubeTextureLoader();
    const mat = loader.load(getImagePaths(path));
    scene.background = mat;
    scene.environment = mat;
  }, [path]) //eslint-disable-line

  return null;
};

export const classes = {
  1 : 'Warrior',
  2 : 'Cleric',
  3 : 'Paladin',
  4 : 'Ranger',
  5 : 'Shadowknight',
  6 : 'Druid',
  7 : 'Monk',
  8 : 'Bard',
  9 : 'Rogue',
  10: 'Shaman',
  11: 'Necromancer',
  12: 'Wizard',
  13: 'Mage',
  14: 'Enchanter',
  20: 'Warrior GM',
  21: 'Cleric GM',
  22: 'Paladin GM',
  23: 'Ranger GM',
  24: 'Shadowknight GM',
  25: 'Druid GM',
  26: 'Monk GM',
  27: 'Bard GM',
  28: 'Rogue GM',
  29: 'Shaman GM',
  30: 'Necromancer GM',
  31: 'Wizard GM',
  32: 'Mage GM',
  33: 'Enchanter GM',
  41: 'Merchant',
  60: 'LDON Recruiter',
  61: 'LDON Merchant',
  63: 'Tribute Master',
};

export function traverseMaterials(object, callback) {
  object.traverse((node) => {
    if (!node.isMesh) {
      return;
    }
    const materials = Array.isArray(node.material)
      ? node.material
      : [node.material];
    materials.forEach(callback);
  });
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

export const RenderedZone = forwardRef(
  (
    {
      zoneName,
      zoneDetails = [],
      controls,
      character,
      spawns = [],
      myTarget,
      canvasRef,
      onLoaded = () => {},
      groupMembers,
      doTarget = () => {},
      socket,
      selectedProcess,
      staticSpawns,
      options,
      parseInfo,
      spawnContextMenu = () => {}
    },
    forwardRef,
  ) => {
    const {
      camera,
      gl: { domElement },
    } = useThree();

   
    const {
      showPoiLoc,
      staticSpawnColor,
      showStaticSpawnDetails,
      skybox,
      maxTargetDisplay = 1000,
      maxPoiDisplay = 1000,
      maxStaticDisplay = 500,
      fontSize = 15,
      charColor,
      groupColor,
      showStaticSpawnModels,
      wireframe,
      spawnWireframe,
      locationRaycast,
      locationTrails,
      locationTrailOpacity,
      locationTrailDashed,
      characterRace,
      locationColor,
      charSize,
      charGender,
      charVariation,
      charTexture,
      charAnimation,
      setAnimationList,
      cameraType,
      cameraFollowMe,
      followTel,
      axesHelp,
      axesSize
    } = options;
    // Skybox
    useSkybox(skybox);
    const [originalTarget, setOriginalTarget] = useState(null);
    const [doFollow, setDoFollow] = useState(false);
    const [target, setTarget] = useState(myTarget);
    const [staticIndex, setStaticIndex] = useState(-1);
    const [rayTarget, setRayTarget] = useState(null);
    const prevLoc = useRef({ x: null, y: null, z: null });

    const characterRef = useRef();
    const parseRef = useRef();
    const raycastRef = useRef(null);
    const axesRef = useRef(null);

    const followPulse = useThrottledCallback(
      (override = false) => {
        if (!character || !socket || (!override && !followTel)) {
          return;
        }
        socket.emit('doAction', {
          processId: selectedProcess.pid,
          payload  : {
            x: camera.position.z,
            z: camera.position.y - 15,
            y: camera.position.x * -1,
          },
          type: 'tel',
        });
      },
      250,
      { trailing: true },
    );

    // const zoneTexture2 = useLoader(GLTFLoader, `${storageUrl}/${zoneName}.glb`);

    const [zoneTexture, pctComplete] = useCachedTexture(`${storageUrl}/${zoneName}.glb`);
      
    useEffect(() => {
      const listener = (e) => {
        if (e.key === 'Escape') {
          setStaticIndex(-1);
        }
      };
      window.addEventListener('keydown', listener);
      return () => window.removeEventListener('keydown', listener);
    }, []);

    useEffect(() => {
      if (!zoneTexture?.scene) {
        return;
      }
      traverseMaterials(zoneTexture?.scene, (material) => {
        material.wireframe = wireframe;
      });
    }, [zoneTexture, wireframe]);

    useEffect(() => {
      function onPointerMove(event) {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        const { top, left } = domElement.getBoundingClientRect();
        const modifiedY = event.clientY - top;
        const modifiedX = event.clientX - left;
        pointer.x = (modifiedX / domElement.scrollWidth) * 2 - 1;
        pointer.y = -(modifiedY / domElement.scrollHeight) * 2 + 1; 
      }

      function onDoubleClick() {
        raycaster.setFromCamera(pointer, camera);
        const firstIntersectingSpawn = raycaster.intersectObjects(
          zoneTexture?.scene?.parent?.children?.filter(a => a.spawn)
        )?.[0]?.object?.spawn;
        if (firstIntersectingSpawn) {
          doTarget(firstIntersectingSpawn.id);
        }
      }

      function onClick() {
        
        // raycaster.setFromCamera(pointer, camera);
        // const firstIntersectingSpawn = raycaster.intersectObjects(
        //   zoneTexture?.scene?.parent?.children?.filter(a => a.spawn)
        // )?.[0]?.object?.spawn;
        // if (firstIntersectingSpawn) {
        //   setTarget(firstIntersectingSpawn);
        // }
      }

      function onContextMenu(e) {
        raycaster.setFromCamera(pointer, camera);
        const firstIntersectingSpawn = raycaster.intersectObjects(
          zoneTexture?.scene?.parent?.children?.filter(a => a.spawn)
        )?.[0]?.object?.spawn;
        if (firstIntersectingSpawn) {
          spawnContextMenu(firstIntersectingSpawn);
          e.stopPropagation();
          e.preventDefault();
        }
      }
      
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('click', onClick);
      window.addEventListener('dblclick', onDoubleClick);
      window.addEventListener('contextmenu', onContextMenu);
      return () => {
        if (window) {
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('click', onClick);
          window.removeEventListener('dblclick', onDoubleClick);
          window.removeEventListener('contextmenu', onContextMenu);

        }
      };
    }, [domElement, zoneTexture?.scene]); // eslint-disable-line

    // eslint-disable-next-line complexity
    useFrame(() => {
      const ctx = canvasRef.current?.getContext?.('2d');
      ctx && ctx.clearRect(0, 0, domElement.width, domElement.height);

      if (!canvasRef.current) {
        return;
      }

      if (pctComplete !== 1 && pctComplete !== 0) {
        const canvas = canvasRef.current;
        if (!ctx || !canvas) {
          return;
        }
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.clearRect(
          0,
          0,
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight,
        );
        ctx.font = '25px arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';

        ctx.fillText(`Loading ${zoneName}: ${(pctComplete * 100).toFixed(2)}%`, centerX, centerY + 4);
      } 

      if (!canvasRef.current || !zoneTexture?.scene) {
        return;
      }

      if (domElement.clientWidth !== canvasRef.current.width || domElement.clientHeight !== canvasRef.current.height) {
        canvasRef.current.width = domElement.clientWidth;
        canvasRef.current.height = domElement.clientHeight;
      }

      const frustum = new THREE.Frustum();
      frustum.setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse,
        ),
      );
      followPulse();

      // Axes Helper
      if (axesRef.current && axesHelp) {
        const coordMap = [
          { axis: 'Y', pt: new THREE.Vector3(axesSize / 3, 0, 0) },
          { axis: 'Z', pt: new THREE.Vector3(0, axesSize / 3, 0) },
          { axis: 'X', pt: new THREE.Vector3(0, 0, axesSize / 3) },
        ];
        for (const { axis, pt } of coordMap.filter(({ pt }) => frustum.containsPoint(pt))) {
          const screen = worldToScreen(
            canvasRef.current,
            pt,
            camera,
          );
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
          const label = `${axis} Axis`;
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `bold ${fontSize + 3}px Arial`;
          ctx.textAlign = 'center';
          const nameWidth = ctx.measureText(label).width;

          ctx.fillText(
            label,
            screen.x -
            side * 2 -
            side * nameWidth -
            side * 16 +
            (nameWidth * side) / 2,
            screen.y - 64 + 6,
          );
        }
        // console.log('axes', axesRef.current);
        // const { geometry: { vertices: [, { x, y, z }] } } = axesRef.current;
        
      }
      for (const spawn of spawns.filter(
        (s) =>
          !groupMembers.some((g) => g.displayedName === s.displayedName) &&
          frustum.containsPoint(new THREE.Vector3(s.y * -1, s.z + 15, s.x)) &&
          camera.position.distanceTo(
            new THREE.Vector3(s.y * -1, s.z + 5, s.x),
          ) < maxTargetDisplay,
      )) {
        const screen = worldToScreen(
          canvasRef.current,
          new THREE.Vector3(spawn.y * -1, spawn.z + 8, spawn.x),
          camera,
        );
        let side = 1;
        if (screen.x > canvasRef.current.width / 2) {
          side = -1;
        }
        const isTarget = spawn.id === target?.id;
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
        ctx.font = isTarget
          ? `bold ${fontSize + 3}px Arial`
          : `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        const nameWidth = ctx.measureText(spawn.displayedName).width;

        ctx.fillText(
          spawn.displayedName,
          screen.x -
            side * 2 -
            side * nameWidth -
            side * 16 +
            (nameWidth * side) / 2,
          screen.y - 64 + 6,
        );

        ctx.fillStyle = '#FFFFFF';
        ctx.font = isTarget
          ? `bold ${fontSize + 3}px Arial`
          : `bold ${fontSize}px Arial`;
        const level = `Level ${spawn.level} ${classes[spawn.classId] ?? ''}${spawn.spawnType === 3 || spawn.spawnType === 2 ? '\'s Corpse' : ''}`;

        ctx.fillText(
          level,
          screen.x -
            side * 2 -
            side * nameWidth -
            side * 16 +
            (nameWidth * side) / 2,
          screen.y - 44 + (fontSize - 13),
        );
      }
      for (const spawnGroup of staticSpawns.filter(
        (spawnGroup) =>
          spawnGroup[0] &&
          frustum.containsPoint(
            new THREE.Vector3(
              spawnGroup[0].y * -1,
              spawnGroup[0].z + 15,
              spawnGroup[0].x,
            ),
          ) &&
          camera.position.distanceTo(
            new THREE.Vector3(
              spawnGroup[0].y * -1,
              spawnGroup[0].z + 15,
              spawnGroup[0].x,
            ),
          ) < maxStaticDisplay,
      )) {
        const screen = worldToScreen(
          canvasRef.current,
          new THREE.Vector3(
            spawnGroup[0].y * -1,
            spawnGroup[0].z + 5,
            spawnGroup[0].x,
          ),
          camera,
        );
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
        let yOffset = 0;
        let idx = 0;
        for (const staticSpawn of spawnGroup) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `bold ${fontSize + 2}px Arial`;
          ctx.textAlign = 'center';
          const name = `${staticSpawn.name.replace(/_/g, ' ')} ${
            staticSpawn.chance
          }% Spawn Chance`;
          const nameWidth = ctx.measureText(name).width;

          if (staticIndex !== staticSpawns.indexOf(spawnGroup) && idx > 0) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `bold italic ${fontSize + 1}px Arial`;
            const details = '[Click for additional spawns/locations]';
            if (!showStaticSpawnDetails) {
              yOffset -= 20;
            }
            ctx.fillText(
              details,
              screen.x -
                side * 2 -
                side * nameWidth -
                side * 16 +
                (nameWidth * side) / 2,
              screen.y - 64 + 6 + yOffset,
            );
            break;
          }

          idx++;

          ctx.fillText(
            name,
            screen.x -
              side * 2 -
              side * nameWidth -
              side * 16 +
              (nameWidth * side) / 2,
            screen.y - 64 + 6 + yOffset,
          );
          if (showStaticSpawnDetails) {
            yOffset += 5;
            ctx.font = `italic ${fontSize + 2}px Arial`;
            const level = `Level ${staticSpawn.level} ${
              classes[staticSpawn.class]
            } :: Health: ${staticSpawn.hp}`;
            ctx.fillText(
              level,
              screen.x -
                side * 2 -
                side * nameWidth -
                side * 16 +
                (nameWidth * side) / 2,
              screen.y - 44 + (fontSize - 13) + yOffset,
            );
            yOffset += 20;

            const loc = `(${staticSpawn.y}, ${staticSpawn.x}, ${staticSpawn.z})`;
            ctx.fillText(
              loc,
              screen.x -
                side * 2 -
                side * nameWidth -
                side * 16 +
                (nameWidth * side) / 2,
              screen.y - 44 + (fontSize - 13) + yOffset,
            );

            yOffset += 20;

            const respawn = `Respawn Timer: ${(
              staticSpawn.respawnTime / 60
            ).toFixed(2)} minutes`;
            ctx.fillText(
              respawn,
              screen.x -
                side * 2 -
                side * nameWidth -
                side * 16 +
                (nameWidth * side) / 2,
              screen.y - 44 + (fontSize - 13) + yOffset,
            );
          }
          yOffset += 35;
        }
      }

      for (const zoneDetail of zoneDetails.filter(
        (zd) =>
          frustum.containsPoint(
            new THREE.Vector3(zd.y * -1, zd.z + 15, zd.x),
          ) &&
          camera.position.distanceTo(
            new THREE.Vector3(zd.y * -1, zd.z + 15, zd.x),
          ) < maxPoiDisplay,
      )) {
        const screen = worldToScreen(
          canvasRef.current,
          new THREE.Vector3(zoneDetail.y * -1, zoneDetail.z + 5, zoneDetail.x),
          camera,
        );
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
        ctx.font = `bold ${fontSize + 2}px Arial`;
        ctx.textAlign = 'center';
        const nameWidth = ctx.measureText(zoneDetail.description).width;

        ctx.fillText(
          zoneDetail.description,
          screen.x -
            side * 2 -
            side * nameWidth -
            side * 16 +
            (nameWidth * side) / 2,
          screen.y - 64 + 6,
        );
        if (showPoiLoc) {
          ctx.font = `italic ${fontSize + 2}px Arial`;
          const loc = `(${zoneDetail.y}, ${zoneDetail.x}, ${zoneDetail.z})`;
          ctx.fillText(
            loc,
            screen.x -
              side * 2 -
              side * nameWidth -
              side * 16 +
              (nameWidth * side) / 2,
            screen.y - 44 + (fontSize - 13),
          );
        }
      }
      if (locationRaycast) {
        raycaster.setFromCamera(pointer, camera);

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(
          zoneTexture?.scene?.children,
        );
        if (intersects.length) {
          const pt = intersects[0].point;
          // pt.set(pt.x - 30, pt.y, pt.z - 30);
          setRayTarget(pt);
          const screen = worldToScreen(
            canvasRef.current,
            new THREE.Vector3(pt.x, pt.y, pt.z),
            camera,
          );
          let side = 1;
          if (screen.x > canvasRef.current.width / 2) {
            side = -1;
          }
          ctx.strokeStyle = '#FFFFFF';

          ctx.beginPath();
          ctx.moveTo(screen.x, screen.y);
          ctx.lineTo(screen.x - side * 56, screen.y);
          ctx.lineTo(screen.x - side * 80, screen.y - 60);
          ctx.stroke();

          ctx.textAlign = 'start';
          if (side === -1) {
            ctx.textAlign = 'end';
          }
          ctx.fillStyle = 'gold';
          ctx.font = `bold ${fontSize + 3}px Arial`;
          ctx.textAlign = 'center';
          const detail = processMode ? 'Warp (T) Move (R)' : 'Location Raycast';
          const detailWidth = ctx.measureText(detail).width;

          ctx.fillText(
            detail,
            screen.x -
              side * 2 -
              side * detailWidth -
              side * 16 +
              (detailWidth * side) / 2,
            screen.y - 64 + 3,
          );

          ctx.font = `italic bold ${fontSize + 3}px Arial`;
          if (rayTarget) {
            const level = `(${(rayTarget.x * -1).toFixed(2)}, ${(
              rayTarget.z - 15
            ).toFixed(2)}, ${rayTarget.y.toFixed(2)})`;
            ctx.fillText(
              level,
              screen.x -
                side * 2 -
                side * detailWidth -
                side * 16 +
                (detailWidth * side) / 2,
              screen.y - 44,
            );
          }
          
        }
      }
      const drawNames = (location, name, subheader, color, zOffset = 0) => {
        if (!location) {
          return;
        }
        const screen = worldToScreen(
          canvasRef.current,
          new THREE.Vector3(location.y * -1, location.z + 7 + zOffset, location.x),
          camera,
        );
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
        ctx.fillStyle = color;
        ctx.font = `bold ${fontSize + 3}px Arial`;
        ctx.textAlign = 'center';
        const nameWidth = ctx.measureText(name).width;

        ctx.fillText(
          name,
          screen.x -
            side * 2 -
            side * nameWidth -
            side * 16 +
            (nameWidth * side) / 2,
          screen.y - 64 + 6,
        );

        ctx.font = `italic bold ${fontSize + 3}px Arial`;
        ctx.fillText(
          subheader,
          screen.x -
            side * 2 -
            side * nameWidth -
            side * 16 +
            (nameWidth * side) / 2,
          screen.y - 44,
        );
      };

      if (character) {
        drawNames(
          character,
          `${character?.displayedName} (Me)`,
          `Level ${character.level}  ${classes[character.classId] ?? ''}`,
          charColor?.css?.backgroundColor,
          charSize
        );
      }
      for (const groupMember of groupMembers) {
        drawNames(
          groupMember,
          `${groupMember?.displayedName} (Group)`,
          `Level ${groupMember.level}  ${classes[groupMember.classId] ?? ''}`,
          groupColor?.css?.backgroundColor,
        );
      }

      if (parseInfo?.locations?.[0]) {
        const loc = parseInfo?.locations?.[0];
        drawNames(
          loc,
          `${parseInfo?.displayedName}`,
          `(${loc.y}, ${loc.x}, ${loc.z})`,
          charColor?.css?.backgroundColor,
          charSize
        );
      }
    });

    useEffect(() => {
      if (myTarget) {
        setTarget(myTarget);
        setTimeout(() => {
          const associatedTargetPosition = new THREE.Vector3(
            myTarget.y * -1,
            myTarget.z + 15,
            myTarget.x,
          );

          const lookPosition = new THREE.Vector3(
            associatedTargetPosition.x + 100,
            associatedTargetPosition.y + 100,
            associatedTargetPosition.z + 100,
          );
          camera.position.set(lookPosition.x, lookPosition.y, lookPosition.z);
          controls.current.target.copy(associatedTargetPosition);
          camera.lookAt(associatedTargetPosition);
        }, 0);
      }
    }, [myTarget]) //eslint-disable-line

    const charRef = useRef(null);
    charRef.current = character;

    const targetObject = useCallback((obj = charRef?.current || character || parseInfo?.locations?.[0]) => {
      if (!zoneTexture?.scene) {
        return;
      }
      zoneTexture?.scene?.position?.set(0, 0, 0);
      setTimeout(() => {
        const charPosition = new THREE.Vector3(
          (obj?.y ?? 0) * -1,
          (obj?.z ?? 0) + 15,
          obj?.x ?? 0,
        );
        const lookPosition = new THREE.Vector3(
          charPosition.x,
          charPosition.y + 150,
          charPosition.z,
        );
        camera.position.set(lookPosition.x, lookPosition.y, lookPosition.z);
        controls.current.target?.copy?.(charPosition);
        camera.lookAt(charPosition);
      }, 0);
    }, [zoneTexture, character, parseInfo]) //eslint-disable-line

    useEffect(() => {
      targetObject();
      if (zoneTexture) {
        onLoaded();
      }
    }, [zoneTexture]) //eslint-disable-line

    //
    useEffect(() => {
      if (controls.current?.reset) {
        controls.current.reset();
      }
    }, [zoneName, controls]);
    window.cam = camera;
    useEffect(() => {
      if (!(character || parseRef.current) || !doFollow) {
        return;
      }
      if (parseRef.current) {
        const [first, second] = parseInfo.locations;
        if (first && second && cameraType === 'fly') {
          const nextLoc = new THREE.Vector3(second.y * -1, second.z, second.x);
          const myLoc = new THREE.Vector3(first.y * -1, first.z, first.x);
          const heading =
            -1 * Math.atan2(myLoc.z - nextLoc.z, myLoc.x - nextLoc.x);
          const offset = new THREE.Vector3(0, charSize, 0);
          camera.position.addVectors(parseRef.current.position, offset);
          camera.rotation.set(0, heading - Math.PI / 2, 0);
        } else {
          const offset = new THREE.Vector3(
            0,
            camera.position.distanceTo(parseRef.current.position),
            0,
          );
          camera.position.addVectors(parseRef.current.position, offset);
        }
      } else {
        if (cameraType === 'fly') { 
          const offset = new THREE.Vector3(0, charSize, 0);
          camera.position.addVectors(characterRef.current.position, offset);
          camera.rotation.set(0, characterRef.current.rotation.y - (Math.PI / 2), 0);

        } else {
          const offset = new THREE.Vector3(
            0,
            camera.position.distanceTo(characterRef.current.position),
            0,
          );
          camera.position.addVectors(characterRef.current.position, offset);
        }
        
      }
    }, [
      character,
      doFollow,
      parseInfo,
      cameraType,
      charSize,
      camera,
    ]) // eslint-disable-line

    const followMe = (doFollow) => {
      if (doFollow) {
        setOriginalTarget(controls.current.target);
        controls.current.target =
          parseRef?.current?.position ?? characterRef?.current?.position;
      } else {
        controls.current.target = originalTarget;
      }
      setDoFollow(doFollow);
    };

    useEffect(() => {
      if (zoneTexture?.scene && parseRef.current?.position) {
        followMe(cameraFollowMe);
      }
    }, [zoneTexture?.scene, cameraFollowMe, parseInfo]); // eslint-disable-line

    useEffect(() => {
      const keyHandler = event => {
        if (event.key === 't' && raycastRef?.current && rayTarget?.x) {
          socket.emit('doAction', {
            processId: selectedProcess.pid,
            payload  : {
              y: (rayTarget.z) + 0.01,
              z: (rayTarget.y) + 0.01,
              x: (rayTarget.x * -1) + 0.01,
            },
            type: 'warp',
          });

          setTimeout(() => {
            targetObject();
          }, 50);
        }

        if (event.key === 'r' && raycastRef?.current && rayTarget?.x) {
          const y = (rayTarget.z) + 0.01;
          const z = (rayTarget.y) + 0.01;
          const x = (rayTarget.x * -1) + 0.01;
          socket.emit('doAction', {
            processId: selectedProcess.pid,
            payload  : {
              command: `/moveto loc ${x} ${y} ${z}`
            },
            type: 'command',
          });
        }
      };
      window.addEventListener('keydown', keyHandler);

      return () => window.removeEventListener('keydown', keyHandler);
    }, [rayTarget, socket, selectedProcess.pid, targetObject]);

    useEffect(() => {

      if (character?.x === undefined) {
        return;
      }

      if (prevLoc.current.x !== null) {
        const deltaX = character.x - prevLoc.current.x;
        const deltaY = character.y - prevLoc.current.y;
        const deltaZ = character.z - prevLoc.current.z;

        const offset = new THREE.Vector3(deltaY * -1, deltaZ, deltaX);
        camera.position.addVectors(camera.position, offset);
      }

      prevLoc.current.x = character.x;
      prevLoc.current.y = character.y;
      prevLoc.current.z = character.z;
    }, [character?.x, character?.y, character?.z, camera.position]);


    // Expose functions to parent
    useImperativeHandle(forwardRef, () => ({
      targetObject,
      followMe,
      doTel: followPulse,
    }));

    const renderedStaticSpawns = useMemo(
      () =>
        staticSpawns.flatMap((s) =>
          s.every((sp) => sp.chance === 100) ? s : s[0],
        ),
      [staticSpawns],
    );

    const locLine = useMemo(() => {
      const locations = parseInfo?.locations?.slice?.(0, locationTrails);
      const color = locationColor?.css?.backgroundColor;
      if (locations?.length) {
        const positions = [];
        const colors = [];
        const color2 = new THREE.Color();
        for (const { x, y, z } of locations) {
          positions.push(y * -1, z + 5, x);
          colors.push(color2.r, color2.g, color2.b);
        }
        const geometry = new LineGeometry();
        geometry.setPositions(positions);
        geometry.setColors(colors);
        const matLine = new LineMaterial({
          color,
          linewidth      : 0.01, // in world units with size attenuation, pixels otherwise
          vertexColors   : true,
          opacity        : locationTrailOpacity,
          gapSize        : 2,
          dashSize       : 3,
          // resolution:  // to be set by renderer, eventually
          dashed         : locationTrailDashed,
          alphaToCoverage: true,
        });
        const line = new Line2(geometry, matLine);
        line.computeLineDistances();
        line.scale.set(1, 1, 1);
        return line;
      }
    }, [
      parseInfo,
      locationTrails,
      locationColor,
      locationTrailOpacity,
      locationTrailDashed,
    ]);

    return (
      <>
        {/** Spawns */}
        {spawns.map((s) => {
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
              {s.primary > 0 && !(s.primary >= 140 && s.primary <= 160) ? <Item id={s.primary} position={[s.y * -1, s.z + 5, s.x - 5]} /> : null}
              {s.offhand > 0 && !(s.primary >= 140 && s.primary <= 160) ? <Item id={s.offhand} position={[s.y * -1, s.z + 5, s.x + 5]} /> : null}
              <mesh
                spawn={s}
                position={[s.y * -1, s.z + 5, s.x]}
              >
                <sphereBufferGeometry args={[4]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </React.Fragment>
          );
        })}
        {/** Static Spawns */}
        {renderedStaticSpawns.map((s, i) => {
          const color = staticSpawnColor?.css?.backgroundColor ?? 'blue';
          const fallback = (
            <mesh
              onClick={() => setStaticIndex(i)}
              spawn={{ ...s, heading: (-1 * s.heading) / 100 }}
              position={[s.y * -1, s.z + 5, s.x]}
            >
              <octahedronBufferGeometry args={[7]} />
              <meshStandardMaterial color={color} />
            </mesh>
          );

          return (
            <React.Fragment key={`spawn-${s.id}-${i}`}>
              {showStaticSpawnModels ? (
                <Suspense fallback={fallback}>
                  <RenderedSpawn
                    wireframe={spawnWireframe}
                    maxDisplay={maxStaticDisplay}
                    fallback={fallback}
                    spawn={s}
                    i={i}
                    setStaticIndex={setStaticIndex}
                  />
                </Suspense>
              ) : (
                fallback
              )}
            </React.Fragment>
          );
        })}
        {/* Our character - sword model */}
        {character && (
          <>
            <RenderedSpawn
              ref={characterRef}
              key={'parsed-info-spawn'}
              maxDisplay={Infinity}
              fallback={null}
              setAnimationList={setAnimationList}
              spawn={{
                ...character,
                heading  : ((character.heading / 100) + 0.5) - Math.PI,
                z        : character.z + charSize,
                gender   : charGender,
                texture  : charTexture,
                variation: charVariation,
                size     : charSize,
                id       : 'parsedChar',
                race     : characterRace,
                animation: charAnimation,
              }}
            />
            {/* Spotlight over our head */}
            <spotLight
              intensity={5.5}
              angle={0.3}
              penumbra={0.8}
              color={'white'}
              target={characterRef.current}
              position={[character.y * -1, character.z + 145, character.x]}
            />
          </>
        )}
        {/** Raycast Loc */}
        {locationRaycast && rayTarget && (
          <>
            <mesh
              ref={raycastRef}
              position={[rayTarget.x, rayTarget.y, rayTarget.z]}
            >
              <sphereBufferGeometry args={[processMode ? 5 : 12]} />
              <meshStandardMaterial color={'gold'} />
            </mesh>
            {raycastRef.current && (
              <spotLight
                intensity={2.5}
                angle={0.3}
                penumbra={0.8}
                color={'pink'}
                target={raycastRef.current}
                position={[rayTarget.x, rayTarget.y + 150, rayTarget.z]}
              />
            )}
          </>
        )}
        {/* Parsed Info */}
        {parseInfo?.locations?.slice(0, 2).map((pi, index, arr) => {
          const loc = [pi.y * -1 - 3, pi.z + 5, pi.x + 4];

          if (index === 0) {
            let heading = 0;
            if (arr[index + 1]) {
              const next = arr[index + 1];
              const nextLoc = new THREE.Vector3(next.y * -1, next.z, next.x);
              const myLoc = new THREE.Vector3(pi.y * -1, pi.z, pi.x);
              heading =
                -1 * Math.atan2(myLoc.z - nextLoc.z, myLoc.x - nextLoc.x);
            }
            return (
              <React.Fragment>
                <RenderedSpawn
                  ref={parseRef}
                  key={'parsed-info-spawn'}
                  maxDisplay={Infinity}
                  fallback={null}
                  setAnimationList={setAnimationList}
                  spawn={{
                    ...pi,
                    heading,
                    z        : pi.z + charSize,
                    gender   : charGender,
                    texture  : charTexture,
                    variation: charVariation,
                    size     : charSize,
                    id       : 'parsedChar',
                    race     : characterRace,
                    animation: charAnimation,
                  }}
                />
                
                <spotLight
                  intensity={2.5}
                  angle={0.3}
                  penumbra={0.8}
                  color={'pink'}
                  target={parseRef.current}
                  position={[loc[0], loc[1] + 150, loc[2]]}
                />
                
              </React.Fragment>
            );
          }
          return null;
        })}
        {/* Our zone */}
        {zoneTexture && <primitive object={zoneTexture?.scene} />}
        {locLine && <primitive object={locLine} />}
        {axesHelp && <axesHelper ref={axesRef} args={[axesSize]} />}
      </>
    );
  },
);

export function getNormal(u, v) {
  return new THREE.Plane().setFromCoplanarPoints(new THREE.Vector3(), u, v)
    .normal;
}

export function signedAngleTo(u, v) {
  // Get the signed angle between u and v, in the range [-pi, pi]
  const angle = u.angleTo(v);
  const normal = getNormal(u, v);
  return normal.z * angle;
}

export function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper sx={{ width: '100%', minWidth: 450 }} {...props} />
    </Draggable>
  );
}
