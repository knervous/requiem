import React, { forwardRef, useEffect, useMemo } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils,
} from 'three';
import { OrbitControls, PointerLockControls } from '@react-three/drei';
import CameraControlsDef from 'camera-controls';
import { useRef } from 'react';
import { useToasts } from 'react-toast-notifications';


const subsetOfTHREE = {
  MOUSE     : MOUSE,
  Vector2   : Vector2,
  Vector3   : Vector3,
  Vector4   : Vector4,
  Quaternion: Quaternion,
  Matrix4   : Matrix4,
  Spherical : Spherical,
  Box3      : Box3,
  Sphere    : Sphere,
  Raycaster : Raycaster,
  MathUtils : {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp  : MathUtils.clamp,
  },
};


CameraControlsDef.install({ THREE: subsetOfTHREE });
extend({ CameraControlsDef });

const noPointerLock =
  new URLSearchParams(window.location.search).get('plock') === 'false';

const KEYCODE = {
  W          : 87,
  A          : 65,
  S          : 83,
  D          : 68,
  Q          : 81,
  E          : 69,
  X          : 88,
  SHIFT      : 16,
  SPACE      : 32,
  ARROW_LEFT : 37,
  ARROW_UP   : 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN : 40,
};

export const CameraControls = forwardRef(
  ({ controls, type = 'orbit', flySpeed = 10, addToast }, ref) => {
    const {
      camera,
      gl: { domElement },
    } = useThree();


    const derivedType = useMemo(() => {
      if (type === 'fly' && noPointerLock) {
        return 'fly-backup';
      }
      return type;
    }, [type]);

    useEffect(() => {
      if (derivedType === 'fly-backup') {
        // controls.current.zoom(1);
        controls.current.mouseButtons.middle = CameraControlsDef.ACTION.NONE;
        controls.current.mouseButtons.wheel = CameraControlsDef.ACTION.NONE;
        controls.current.mouseButtons.left = controls.current.mouseButtons.right = CameraControlsDef.ACTION.ROTATE;
      }
    }, [derivedType, controls]);

    const moveState = useRef({
      forward    : 0,
      back       : 0,
      left       : 0,
      right      : 0,
      up         : 0,
      down       : 0,
      doubleSpeed: false,
      jump       : false,
      duck       : false,
    });
    const lockRef = useRef(null);

    useEffect(() => {
      if (derivedType === 'fly' && controls.current) {
        controls.current.connect();
      }
    }, [derivedType, controls]);

    useEffect(() => {
      const listener = (val) => (event) => {
        const newState = { ...moveState.current };
        switch (event.keyCode) {
          case KEYCODE.W:
            newState.forward = val;
            newState.back = 0;
            break;
          case KEYCODE.A:
            newState.left = val;
            break;
          case KEYCODE.S:
            newState.back = val;
            newState.forward = 0;
            break;
          case KEYCODE.D:
            newState.right = val;
            break;
          case KEYCODE.Q:
            newState.down = val;
            break;
          case KEYCODE.E:
            newState.up = val;
            break;
          case 16:
            newState.doubleSpeed = Boolean(val);
            break;
          case 32:
            newState.jump = Boolean(val);
            break;
          case 88:
            newState.duck = Boolean(val);
            break;
          default:
            break;
        }
        moveState.current = newState;
        addToast(JSON.stringify(moveState.current));
      };
      const downListener = listener(1);
      const upListener = listener(0);

      const mouseDown = (e) => {
        if (e.button === 2) {
          if (document.activeElement) {
            document.activeElement.blur();
          }
          lockRef.current = true;
        } else {
          setTimeout(() => {
            controls.current.unlock();
            lockRef.current = false;
          }, 200);
        }
      };

      const mdBackup = () => {
        // domElement.tabIndex = 0;
        // domElement.focus();
      };
      const mouseUp = async () => {
        lockRef.current = false;
      };
      const preventDefault = (e) => e.preventDefault();

      domElement.addEventListener('keydown', downListener);
      domElement.addEventListener('keyup', upListener);
      window.addEventListener('keydown', downListener);
      window.addEventListener('keyup', upListener);
      window.addEventListener('contextmenu', preventDefault);

      if (derivedType === 'fly') {
        domElement.addEventListener('mousedown', mouseDown);
        window.addEventListener('mouseup', mouseUp);
      }
      if (derivedType === 'fly-backup') {
        domElement.addEventListener('mousedown', mdBackup);
      }

      return () => {
        domElement.removeEventListener('mousedown', mdBackup);

        window.removeEventListener('keydown', downListener);
        window.removeEventListener('keyup', upListener);
        domElement.removeEventListener('keydown', downListener);
        domElement.removeEventListener('keyup', upListener);
        window.removeEventListener('contextmenu', preventDefault);
        domElement.removeEventListener('mousedown', mouseDown);
        window.removeEventListener('mouseup', mouseUp);
      };
    }, [derivedType, controls, domElement]);

    // Ref to the controls, so that we can update them on every frame using useFrame
    useFrame((state, delta) => {
      const velocity = new THREE.Vector3();
      
      if (moveState.current.forward > 0) {
        velocity.z -= 1 + flySpeed;
      }
      if (moveState.current.back > 0) {
        velocity.z += 1 + flySpeed;
      }
      if (moveState.current.left > 0) {
        velocity.x -= 1 + flySpeed;
      }
      if (moveState.current.right > 0) {
        velocity.x += 1 + flySpeed;
      }
      if (moveState.current.up > 0) {
        velocity.y += 1 + flySpeed;
      }
      if (moveState.current.down > 0) {
        velocity.y -= 1 + flySpeed;
      }

      if (derivedType === 'fly') {
        velocity
          .multiplyScalar(flySpeed * (moveState.current.doubleSpeed ? 2 : 1))
          .applyQuaternion(state.camera.quaternion);

        if (moveState.current.jump || moveState.current.duck) {
          const jumpvel = new THREE.Vector3();
          jumpvel.y = moveState.current.jump ? 1 : -1;
          jumpvel.multiplyScalar(
            flySpeed * (moveState.current.doubleSpeed ? 2 : 1),
          );
          state.camera.position.add(jumpvel);
        }

        state.camera.position.add(velocity);

        if (lockRef.current) {
          controls.current.lock();
        } else {
          controls.current.unlock();
        }
      }

      if (derivedType === 'fly-backup') {
        velocity.z -= 5;
        velocity
          .multiplyScalar(1 * (moveState.current.doubleSpeed ? 2 : 1))
          .applyQuaternion(state.camera.quaternion);

        if (moveState.current.jump || moveState.current.duck) {
          const jumpvel = new THREE.Vector3();
          jumpvel.y = (moveState.current.jump ? 1 : -1) * flySpeed;
          jumpvel.multiplyScalar(
            1 * (moveState.current.doubleSpeed ? 2 : 1),
          );
          state.camera.position.add(jumpvel);
        }

        const copiedPos = state.camera.position.clone();
        copiedPos.add(velocity);
        controls.current.moveTo(copiedPos.x, copiedPos.y, copiedPos.z);

      }

      // if (type === 'orbit') {
      state.camera.far = 100000;
      state.camera.near = 0.1;
      state.camera.updateProjectionMatrix();
      controls.current?.update?.(delta);
      // }
    });

    return derivedType === 'fly-backup' ? (
      <cameraControlsDef ref={ref} args={[camera, domElement]} />
    ) : derivedType === 'fly' ? (
      <PointerLockControls ref={ref} args={[camera, domElement]} />
    ) : (
      <OrbitControls ref={ref} args={[camera, domElement]} />
    );
  },
);
