import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Zone, useSelector } from '../../state';
import { RenderedSpawn } from './RenderedSpawn';
import mockData from './mockSpawns.json';
import { useScene } from 'react-babylonjs';
import { Vector3 } from '@babylonjs/core';
import { useBablyonContext } from './Context';

export const SpawnPool = () => {
  const spawns = useSelector(Zone.spawns);
  const scene = useScene();
  const { camera } = useBablyonContext();
  const filteredSpawns = mockData; // mockData.filter(a => a.name.includes('Guard')); // useMemo(() => spawns.filter(s => s.race > 0), [spawns]) || ;

  const [cameraPosition, setCameraPosition] = useState(new Vector3(camera?.current?.position) ?? new Vector3());

  useEffect(() => {
    const interval = setInterval(() => {  
      if (!cameraPosition.equals(camera?.current?.position ?? new Vector3())) {
        // console.log('Do set', camera.current.position.clone());
        setCameraPosition(camera.current.position.clone());
        // setFilteredSpawns(mockData.filter(({ x, y, z }) => Vector3.Distance(camera.current.position, new Vector3(y, z, x)) < 200));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [camera, cameraPosition]);
  return filteredSpawns.map((s, i) => {
    return <RenderedSpawn
      cameraPosition={cameraPosition}
      key={`spawn-${s.id}-${i}`}
      spawn={s}
      scene={scene}
      i={i} 
    />;
  });
};