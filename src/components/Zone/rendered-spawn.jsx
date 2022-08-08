import React, { useMemo, useRef, useState } from 'react';

import raceData from '../../common/raceData';

import { useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import * as THREE from 'three';

import { useEffect } from 'react';
import { useThrottledCallback } from 'use-debounce';

const storageUrl = 'https://mqbrowser.blob.core.windows.net/zones/models';

const gltfLoader = new GLTFLoader(new THREE.LoadingManager());

export function RenderedSpawn({ spawn, fallback, maxDisplay, setStaticIndex, i }) {
  const model = useMemo(
    () => raceData.find((r) => r.id === spawn.race)[spawn.gender] || 'HUM',
    [spawn],
  );
  const spawnRef = useRef();
  const [scene, setScene] = useState(null);
  const [canView, setCanView] = useState(false);
  const [animationMixer, setAnimationMixer] = useState(null);

  useEffect(() => {
    if (!canView || scene) {
      return;
    }
    (async () => {
      let scene, animations, isFallback = false;
      try {
        ({ scene, animations } = await gltfLoader.loadAsync(`${storageUrl}/${model.toLowerCase()}.glb`));
      } catch (e) {
        ({ scene, animations } = await gltfLoader.loadAsync(`${storageUrl}/hum.glb`));
        isFallback = true;
      }
      const clone = SkeletonUtils.clone(scene, true);
      if (spawn.texture !== 0 && !isFallback) {
        clone.traverse(node => {
          if (node.isSkinnedMesh) {
            const newTexture = String(spawn.texture).padStart(2, '0');
            const newName = node.material.name.slice(2).replace('00', newTexture).replace(/_/g, '');
            const original = node.material.map.source.data;
            const img = document.createElement('img');
            img.crossOrigin = true;
            img.src = `${storageUrl}/Textures/${newName}.png`;
            img.onload = () => {
              node.material.map.needsUpdate = true;
            };
            img.onerror = () => {
              node.material.map.source.data = original;
            };
            node.material.map.source.data = img;
          }
        });
        
      }
      setScene(clone);
      setTimeout(() => {
        const animationMixer = new THREE.AnimationMixer(spawnRef.current);
        const newActions = {};
        for (const a of animations) {
          newActions[a.name] = animationMixer.clipAction(a, spawnRef.current);
        }
        setActions(newActions);
        setAnimationMixer(animationMixer);
      }, 100);
     
    })();
  }, [model, spawn.texture, canView, scene]);

  const { camera } = useThree();
  const [actions, setActions] = useState({});
  
  useFrame(
    useThrottledCallback(() => {
      if (
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

  useFrame((_, i) => { 
    if (!animationMixer) {
      return;
    }
    animationMixer.update(i);
  });

  useEffect(() => {
    if (canView && actions?.p01) {
      actions.p01.reset().fadeIn(0.5).play();
    }
  }, [actions, canView, animationMixer]);

  return canView && scene ? 
    <React.Fragment key={`spawn-${spawn.id}`}>
      <primitive
        onClick={() => setStaticIndex(i)} 
        ref={spawnRef}
        scale={[spawn.size / 3, spawn.size / 3, spawn.size / 3]}
        rotation={[0.0, (spawn.heading / 100) - 2.5, 0]}
        position={[spawn.y * -1 - 3, spawn.z + 3, spawn.x + 4]}
        object={scene}
      />
    </React.Fragment>
    : 
    fallback
  ;
}
