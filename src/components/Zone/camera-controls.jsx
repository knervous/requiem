
import React, {
  forwardRef, useEffect, useState,
} from 'react';
import {
  useFrame,
  useThree,
} from '@react-three/fiber';
import * as THREE from 'three';

import { OrbitControls } from '@react-three/drei';

export const CameraControls = forwardRef(({ controls }, ref) => {
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