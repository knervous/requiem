import React, { useMemo, useRef, useState } from 'react';

import raceData from '../../common/raceData';

import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { useAnimations } from '@react-three/drei';
import * as THREE from 'three';

import { useEffect } from 'react';
import { useThrottledCallback } from 'use-debounce';

const storageUrl = 'https://mqbrowser.blob.core.windows.net/zones/models';

export function RenderedSpawn({ spawn, fallback, maxDisplay, setStaticIndex, i }) {
  const model = useMemo(
    () => raceData.find((r) => r.id === spawn.race)[spawn.gender] || 'HUM',
    [spawn],
  );
  const spawnRef = useRef();
  let scene, animations;
  try {
    ({ scene, animations } = useLoader(  // eslint-disable-line
      GLTFLoader,
      `${storageUrl}/${model.toLowerCase()}.glb`, 
    ));
  } catch (e) {
    ;({ scene, animations } = useLoader(GLTFLoader, `${storageUrl}/hum.glb`)) // eslint-disable-line
    console.warn('Could not load model', model);
  }
  const [canView, setCanView] = useState(false);
  const { camera } = useThree();
  useFrame(
    useThrottledCallback(() => {
      const frustum = new THREE.Frustum();
      frustum.setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(
          camera.projectionMatrix,
          camera.matrixWorldInverse,
        ),
      );
      if (
        frustum.containsPoint(
          new THREE.Vector3(spawn.y * -1, spawn.z + 15, spawn.x),
        ) &&
        camera.position.distanceTo(
          new THREE.Vector3(spawn.y * -1, spawn.z + 15, spawn.x),
        ) < maxDisplay
      ) {
        setCanView(true);

      } else {
        setCanView(false);
      }
    }, 200),
  );
  const { actions, mixer } = useAnimations(animations, spawnRef);
  const copiedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene, true);
    return clone;
  }, [scene]);

  useEffect(() => {
    if (canView) {
      actions?.p01?.reset()?.fadeIn(0.5)?.play();
    }
    
  }, [actions, mixer, canView]);
  return canView ? (
    scene ? (
      <React.Fragment key={`spawn-${spawn.id}`}>
        <primitive
          onClick={() => setStaticIndex(i)} 
          ref={spawnRef}
          scale={[spawn.size / 3, spawn.size / 3, spawn.size / 3]}
          rotation={[0.0, spawn.heading / 100 - 1.65, 0]}
          position={[spawn.y * -1 - 3, spawn.z + 3, spawn.x + 4]}
          object={copiedScene}
        />
      </React.Fragment>
    ) : null
  ) : (
    fallback
  );
}
