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

import { useLoader, useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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

const classes = {
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

// mock
const mockParseInfo = {
  locations: [
    { x: -447.37, y: -304.92, z: 117.53 },
    { x: -455.15, y: -295.9, z: 117.96 },
    { x: -460.19, y: -290.06, z: 121.71 },
    { x: -467.65, y: -281.4, z: 126.49 },
    { x: -480.02, y: -267.06, z: 135.97 },
    { x: -482.51, y: -264.18, z: 137.89 },
    { x: -487.25, y: -256.44, z: 142.24 },
    { x: -489.57, y: -251.02, z: 144.81 },
    { x: -493.88, y: -245.85, z: 148.33 },
    { x: -502.09, y: -240.82, z: 152.57 },
    { x: -508.88, y: -238.02, z: 156.06 },
    { x: -512.82, y: -236.39, z: 157.68 },
    { x: -516.68, y: -234.79, z: 159.47 },
    { x: -523.82, y: -231.09, z: 161.1 },
    { x: -529.36, y: -227.77, z: 161.1 },
    { x: -532.42, y: -225.94, z: 161.1 },
    { x: -536.15, y: -223.7, z: 161.1 },
    { x: -536.39, y: -223.02, z: 161.1 },
    { x: -536.87, y: -216.77, z: 161.1 },
    { x: -536.79, y: -209.31, z: 161.1 },
  ],
  displayedName: 'Celeryman',
  zoneName     : 'Greater Faydark',
  filePath     : null,
  fileName     : null,
};

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
      follow,
      selectedProcess,
      staticSpawns,
      options,
      parseInfo,
    },
    forwardRef,
  ) => {
    const {
      camera,
      gl: { domElement },
    } = useThree();

    useEffect(() => {
      function onPointerMove(event) {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
      
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }
      
      domElement.addEventListener('pointermove', onPointerMove);
      return () => {
        if (domElement) {
          domElement.removeEventListener('pointermove', onPointerMove);
        }
      };
    }, [domElement]);
   
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
      cameraFollowMe
    } = options;
    // Skybox
    useSkybox(skybox);

    const [originalTarget, setOriginalTarget] = useState(null);
    const [doFollow, setDoFollow] = useState(false);
    const [prevCharacter, setPrevCharacter] = useState(character);
    const [target, setTarget] = useState(myTarget);
    const [staticIndex, setStaticIndex] = useState(-1);
    const [rayTarget, setRayTarget] = useState(null);
    const [{ bannerScale, bannerLoc }, setBanner] = useState({
      bannerScale: 0,
      bannerLoc  : { x: 0, y: 0, z: 0 },
    });
    const characterRef = useRef();
    const parseRef = useRef();
    const raycastRef = useRef(null);

    const followPulse = useThrottledCallback(
      (override = false) => {
        if (!character || !socket || (!override && !follow)) {
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

    const zoneTexture = useLoader(GLTFLoader, `${storageUrl}/${zoneName}.glb`);
    const bannerTexture = useLoader(
      GLTFLoader,
      `${storageUrl}/textures/banner.glb`,
    );
    const characterTexture = useLoader(
      GLTFLoader,
      `${storageUrl}/textures/sword2.glb`,
    );

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
      if (!zoneTexture.scene) {
        return;
      }
      traverseMaterials(zoneTexture.scene, (material) => {
        material.wireframe = wireframe;
      });
    }, [zoneTexture, wireframe]);

    useFrame(() => {
      if (!canvasRef.current) {
        return;
      }
      if (domElement.clientWidth !== canvasRef.current.width || domElement.clientHeight !== canvasRef.current.height) {
        canvasRef.current.width = domElement.clientWidth;
        canvasRef.current.height = domElement.clientHeight;
      }
      const ctx = canvasRef.current?.getContext?.('2d');
   
      ctx.clearRect(0, 0, domElement.width, domElement.height);
      const frustum = new THREE.Frustum();
      frustum.setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse,
        ),
      );
      followPulse();
      for (const spawn of spawns.filter(
        (s) =>
          !groupMembers.some((g) => g.displayedName === s.displayedName) &&
          frustum.containsPoint(new THREE.Vector3(s.y * -1, s.z + 15, s.x)) &&
          camera.position.distanceTo(
            new THREE.Vector3(s.y * -1, s.z + 15, s.x),
          ) < maxTargetDisplay,
      )) {
        const screen = worldToScreen(
          canvasRef.current,
          new THREE.Vector3(spawn.y * -1, spawn.z + 15, spawn.x),
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
          ? `italic bold ${fontSize + 3}px Arial`
          : `italic ${fontSize}px Arial`;
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
          ? `italic bold ${fontSize + 3}px Arial`
          : `italic ${fontSize}px Arial`;
        const level = `Level ${spawn.level} ${classes[spawn.classId] ?? ''}`;

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
        // console.log('Int', intersects);
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
          const detail = 'Location Raycast';
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
      const drawNames = (location, name, subheader, color, zOffset = 0) => {
        if (!location) {
          return;
        }
        const screen = worldToScreen(
          canvasRef.current,
          new THREE.Vector3(location.y * -1, location.z + 7 + zOffset, location.x),
          camera,
        );
        if (name === 'Celeryman') {
          window.ss = screen;
        }
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
          `Level ${character.level}  ${classes[character.classId]}`,
          charColor?.css?.backgroundColor,
        );
      }

      for (const groupMember of groupMembers) {
        drawNames(
          groupMember,
          `${groupMember?.displayedName} (Group)`,
          `Level ${groupMember.level}  ${classes[groupMember.classId]}`,
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

    const targetMe = useCallback(() => {
      if (!zoneTexture.scene) {
        return;
      }
      zoneTexture.scene.position.set(0, 0, 0);
      setTimeout(() => {
        const firstLoc = parseInfo?.locations?.[0];
        const charPosition = new THREE.Vector3(
          (character?.y ?? firstLoc?.y ?? 0) * -1,
          (character?.z ?? firstLoc?.z ?? 0) + 15,
          character?.x ?? firstLoc?.x ?? 0,
        );
        const lookPosition = new THREE.Vector3(
          charPosition.x + 100,
          charPosition.y + 100,
          charPosition.z + 100,
        );
        camera.position.set(lookPosition.x, lookPosition.y, lookPosition.z);
        controls.current.target?.copy?.(charPosition);
        camera.lookAt(charPosition);
      }, 0);
    }, [zoneTexture, character, parseInfo]) //eslint-disable-line

    useEffect(() => {
      targetMe();
      if (zoneTexture) {
        onLoaded();
      }
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
      } else if (
        characterRef.current &&
        !['x', 'y', 'z'].every(
          (key) => character?.[key] === prevCharacter?.[key],
        )
      ) {
        const offset = new THREE.Vector3(
          0,
          camera.position.distanceTo(characterRef.current.position),
          0,
        );
        camera.position.addVectors(characterRef.current.position, offset);
        setPrevCharacter(character);
      }
    }, [
      character,
      prevCharacter,
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

    // Expose functions to parent
    useImperativeHandle(forwardRef, () => ({
      targetMe,
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
              <mesh
                spawn={s}
                onClick={() => {
                  setTarget(s);
                }}
                onDoubleClick={() => {
                  doTarget(s.id);
                }}
                position={[s.y * -1, s.z + 15, s.x]}
              >
                <octahedronBufferGeometry args={[10]} />
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
            <primitive
              ref={characterRef}
              scale={[4, 4, 4]}
              rotation={[1.6, 0, -1.65 + (character.heading * -1) / 100]}
              position={[
                character.y * -1 - 3,
                character.z + 5,
                character.x + 4,
              ]}
              object={characterTexture?.scene}
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
          </>
        )}
        {/** Raycast Loc */}
        {locationRaycast && rayTarget && (
          <>
            <mesh
              ref={raycastRef}
              position={[rayTarget.x, rayTarget.y, rayTarget.z]}
            >
              <octahedronBufferGeometry args={[12]} />
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
          const color = locationColor?.css?.backgroundColor;
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
        })}
        {/* Our zone */}
        <primitive object={zoneTexture?.scene} />
        {locLine && <primitive object={locLine} />}
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
      <Paper sx={{ width: '30vw', minWidth: 450 }} {...props} />
    </Draggable>
  );
}
