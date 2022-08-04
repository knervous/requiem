
import React, {
  forwardRef, useEffect } from 'react';
import {
  useFrame,
  useThree,
} from '@react-three/fiber';
import * as THREE from 'three';

import { OrbitControls, PointerLockControls } from '@react-three/drei';
import { useRef } from 'react';

export const CameraControls = forwardRef(({ controls, type = 'orbit', flySpeed = 10 }, ref) => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const moveState = useRef({
    forward    : 0,
    back       : 0,
    left       : 0,
    right      : 0,
    up         : 0,
    down       : 0,
    doubleSpeed: false,
    jump       : false,
    duck       : false
  });
  const lockState = useRef(false);
  const isLocked = useRef(false);
  useEffect(() => {
    if (type === 'orbit') {
      return;
    }
    const listener = (val) => event => {
      const newState = { ...moveState.current };
      switch (event.keyCode) {
        case 87: /* W*/
          newState.forward = val;
          break;
        case 65: /* A*/
          newState.left = val;
          break;
        case 83: /* S*/
          newState.back = val;
          break;
        case 68: /* D*/
          newState.right = val;
          break;
        case 81: // Q
          newState.down = val;
          break;
        case 69: // E
          newState.up = val;
          break;
        case 16: // Shift
          newState.doubleSpeed = Boolean(val);
          break;
        case 32: // Space
          newState.jump = Boolean(val);
          break;
        case 88: // Space
          newState.duck = Boolean(val);
          break;
        default:
          break;
      }
      moveState.current = newState;
    };
    const downListener = listener(1);
    const upListener = listener(0);
   

    const mouseDown = e => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
      if (e.button === 2) {
        lockState.current = true;
        e.preventDefault();
        e.stopPropagation();
      } else {
        lockState.current = false;

        setTimeout(() => {
          controls.current.unlock();
        }, 200);
        
      }
    };
    const mouseUp = () => {
      controls.current.unlock();
      lockState.current = false;
      setTimeout(() => {
        controls.current.unlock();
        lockState.current = false;
      }, 200);
    };
    const preventDefault = e => e.preventDefault();

    window.addEventListener('keydown', downListener);
    window.addEventListener('keyup', upListener);
    window.addEventListener('contextmenu', preventDefault);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);
    return () => {
      window.removeEventListener('keydown', downListener);
      window.removeEventListener('keyup', upListener);
      window.removeEventListener('contextmenu', preventDefault);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [type, controls]);
  
  // Ref to the controls, so that we can update them on every frame using useFrame
  useFrame((state) => {
    if (type === 'fly') {
      const velocity = new THREE.Vector3();
      if (moveState.current.forward > 0) {
        velocity.z -= 1;
      }
      if (moveState.current.back > 0) {
        velocity.z += 1;
      }
      if (moveState.current.left > 0) {
        velocity.x -= 1;
      }
      if (moveState.current.right > 0) {
        velocity.x += 1;
      }
      if (moveState.current.up > 0) {
        velocity.y += 1;
      }
      if (moveState.current.down > 0) {
        velocity.y -= 1;
      }
  
      velocity.multiplyScalar(flySpeed * (moveState.current.doubleSpeed ? 2 : 1)).applyQuaternion(state.camera.quaternion);

      if (moveState.current.jump || moveState.current.duck) {
        const jumpvel = new THREE.Vector3();
        jumpvel.y = moveState.current.jump ? 1 : -1;
        jumpvel.multiplyScalar(flySpeed * (moveState.current.doubleSpeed ? 2 : 1));
        state.camera.position.add(jumpvel);
      }
      state.camera.position.add(velocity);

      if (lockState.current) {
        controls.current.connect();
        if (!isLocked.current) {
          controls.current.lock();
          isLocked.current = true;
        } 
      } else {
        if (isLocked.current) {
          controls.current.unlock();
          isLocked.current = false;
        }
        
      }
    }

    // if (type === 'orbit') {
    state.camera.far = 100000;
    state.camera.near = 0.1;
    state.camera.updateProjectionMatrix();
    controls.current?.update?.();
    // }
    
  });
  
  return type === 'fly' ? <PointerLockControls ref={ref} args={[camera, domElement]} /> : <OrbitControls ref={ref} args={[camera, domElement]} />;
});