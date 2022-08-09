
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

  useEffect(() => {
    if (type === 'fly' && controls.current) {
      controls.current.connect();
    }
  }, [type]);

  useEffect(() => {
    const listener = (val) => event => {
      const newState = { ...moveState.current };
      switch (event.keyCode) {
        case 87: /* W*/
          newState.forward = val;
          newState.back = 0;
          break;
        case 65: /* A*/
          newState.left = val;
          break;
        case 83: /* S*/
          newState.back = val;
          newState.forward = 0;
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
        case 88: // X
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
      if (e.button === 2) {
        controls.current.lock();
      } else {
        setTimeout(() => {
          controls.current.unlock();
        }, 200); 
      }
      e.preventDefault();
      e.stopPropagation();
    };
    const mouseUp = async () => {
      for (let i = 0; i < 5; i++) {
        controls.current.unlock();
        await new Promise(res => setTimeout(res, 150));
      }
    };
    const preventDefault = e => e.preventDefault();

    if (type === 'fly') {
      window.addEventListener('keydown', downListener);
      window.addEventListener('keyup', upListener);
      window.addEventListener('contextmenu', preventDefault);
      domElement.addEventListener('mousedown', mouseDown);
      window.addEventListener('mouseup', mouseUp);
    }
    
    return () => {
      window.removeEventListener('keydown', downListener);
      window.removeEventListener('keyup', upListener);
      window.removeEventListener('contextmenu', preventDefault);
      domElement.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [type, controls, domElement]);
  
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