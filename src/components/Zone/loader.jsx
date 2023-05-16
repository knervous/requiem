import React from 'react';
import { useProgress, Html } from '@react-three/drei';

export function Loader() {
  const { progress, loaded } = useProgress();
  return (
    <Html center>
      {loaded} Meshes Loaded {progress}% Loaded
    </Html>
  );
}