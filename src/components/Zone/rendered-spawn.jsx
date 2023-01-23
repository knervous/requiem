import React, { forwardRef, useMemo, useRef, useState } from 'react';

import raceData from '../../common/raceData';

import { useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import * as THREE from 'three';

import { useEffect } from 'react';
import { useThrottledCallback } from 'use-debounce';
import { traverseMaterials } from './rendered-zone';

const storageUrl = 'https://mqbrowser.blob.core.windows.net/zones/models';

const gltfLoader = new GLTFLoader(new THREE.LoadingManager());

export const RenderedSpawn = forwardRef(
  (
    { wireframe, spawn, fallback, maxDisplay, setStaticIndex = () => {}, i, setAnimationList = () => {} },
    spawnRef,
  ) => {
    const defaultRef = useRef();
    const model = useMemo(() => {
      const model = raceData.find((r) => r.id === spawn.race);
      return model[spawn.gender] || model['2'] || 'HUM';
    }, [spawn.race, spawn.gender]);
    const [scene, setScene] = useState(null);
    const [canView, setCanView] = useState(false);
    const [animationMixer, setAnimationMixer] = useState(null);
    const race = useRef(null);
    const gender = useRef(null);
    const texture = useRef(null);
    const variation = useRef(null);

    useEffect(() => {
      if (
        !canView ||
        (scene &&
          !(race.current !== spawn.race) &&
          !(gender.current !== spawn.gender) &&
          !(variation.current !== spawn.variation) &&
          !(texture.current !== spawn.texture))
      ) {
        return;
      }
      (async () => {
        let scene,
          animations,
          isFallback = false;
        try {
          
          ({ scene, animations } = await gltfLoader.loadAsync(
            `${storageUrl}/${model.toLowerCase()}${spawn.variation ? `_${spawn.variation}` : ''}.glb`,
          ));
        } catch (e) {
          ({ scene, animations } = await gltfLoader.loadAsync(
            `${storageUrl}/hum.glb`,
          ));
          isFallback = true;
        }
        const clone = SkeletonUtils.clone(scene, true);
        if (spawn.texture !== 0 && !isFallback) {
          clone.traverse((node) => {
            if (node.isSkinnedMesh) {
              const newTexture = String(spawn.texture).padStart(2, '0');
              const newName = node.material.name
                .slice(2)
                .replace('00', newTexture)
                .replace(/_/g, '');
              if (spawn.race >= 1 && spawn.race <= 13 && /he\d+/.test(newName)) {
                return;
              }
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
        race.current = spawn.race;
        texture.current = spawn.texture;
        gender.current = spawn.gender;
        variation.current = spawn.variation;
        setTimeout(() => {
          const ref = spawnRef?.current ?? defaultRef?.current;
          if (!ref) {
            return;
          }
          const animationMixer = new THREE.AnimationMixer(ref);
          const newActions = {};
          for (const a of animations) {
            newActions[a.name] = animationMixer.clipAction(a, ref);
          }
          setAnimationList(animations.map(a => a.name));
          setActions(newActions);
          setAnimationMixer(animationMixer);
        }, 100);
      })();
    }, [model, spawn.texture, canView, scene, spawn.race, spawn.gender, spawn.variation]); // eslint-disable-line

    const { camera } = useThree();
    const [actions, setActions] = useState({});

    useEffect(() => {
      if (!scene) {
        return;
      }
      traverseMaterials(scene, (material) => {
        material.wireframe = wireframe;
      });
    }, [scene, wireframe]);

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
      const animation = spawn.animation || 'p01';
      for (const a of Object.keys(actions)) {
        actions[a].reset().stop();
      }
      if (canView && actions?.[animation]) {
        actions[animation].reset().fadeIn(0.5).play();
      }
    }, [actions, canView, animationMixer, spawn.animation]);

    useEffect(() => {}, [spawn.heading]);
    return canView && scene ? (
      <React.Fragment key={`spawn-${spawn.id}`}>
        <primitive
          onClick={() => setStaticIndex(i)}
          ref={spawnRef ? spawnRef : defaultRef}
          scale={[spawn.size / 3, spawn.size / 3, spawn.size / 3]}
          rotation={[0, spawn.heading, 0]}
          position={[spawn.y * -1, spawn.z, spawn.x]}
          object={scene}
        />
      </React.Fragment>
    ) : (
      fallback
    );
  },
);
