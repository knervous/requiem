import React, { forwardRef, useEffect } from 'react';
import { useCanvas, useScene } from 'react-babylonjs';

import { Vector3 } from '@babylonjs/core';

export const Camera = forwardRef((props, ref) => {
  console.log('hi props ref', props, ref);
  return <UniversalCamera ref={ref} {...props}/>;
});

const UniversalCamera = forwardRef((_props, ref) => {
  const scene = useScene();
  const canvas = useCanvas();
  useEffect(() => {
    let isLocked = false;
    if (scene && canvas) {
      scene.onPointerDown = (e) => {
        if (
          (e.button === 2 && !isLocked && canvas.requestPointerLock) ||
          canvas.msRequestPointerLock ||
          canvas.mozRequestPointerLock ||
          canvas.webkitRequestPointerLock
        ) {
          try {
            canvas.requestPointerLock();
          } catch {}
        }
      };
      scene.onPointerUp = e => {
        if (e.button === 2) {
          document.exitPointerLock();
        }
      };
    }

    const onChangePointerLock = () => {
      const controlEnabled =
        document.mozPointerLockElement ||
        document.webkitPointerLockElement ||
        document.msPointerLockElement ||
        document.pointerLockElement ||
        null;
      if (!controlEnabled) {
        isLocked = false;
      } else {
        isLocked = true;
      }
    };
    document.addEventListener('pointerlockchange', onChangePointerLock, false);
    document.addEventListener('mspointerlockchange', onChangePointerLock, false);
    document.addEventListener(
      'mozpointerlockchange',
      onChangePointerLock,
      false,
    );
    document.addEventListener(
      'webkitpointerlockchange',
      onChangePointerLock,
      false,
    );

    return () => {
      document.removeEventListener(
        'pointerlockchange',
        onChangePointerLock,
        false,
      );
      document.removeEventListener(
        'mspointerlockchange',
        onChangePointerLock,
        false,
      );
      document.removeEventListener(
        'mozpointerlockchange',
        onChangePointerLock,
        false,
      );
      document.removeEventListener(
        'webkitpointerlockchange',
        onChangePointerLock,
        false,
      );
    };
  }, [scene, canvas]);
  return (
    <universalCamera
      position={new Vector3(0, 50, 3)}
      ref={ref}
      // applyGravity
      keysUp={[87]}
      keysDown={[83]}
      keysRight={[68]}
      keysLeft={[65]}
      // checkCollisions
      name="camera1"
      target={Vector3.Zero()}
      ellipsoid={new Vector3(2 * 0.2, 3.5 * 0.2, 2)}
    />
  );
});
