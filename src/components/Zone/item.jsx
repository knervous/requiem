import React, { useState } from 'react';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import * as THREE from 'three';

import { useEffect } from 'react';

const storageUrl = 'https://mqbrowser.blob.core.windows.net/zones/models';

const gltfLoader = new GLTFLoader(new THREE.LoadingManager());

export const Item = 
    ({ position, id }) => {
      const [scene, setScene] = useState(null);

      useEffect(() => {
        (async () => {
          let scene;
          try {
            ({ scene } = await gltfLoader.loadAsync(
            `${storageUrl}/it${id}.glb`,
            ));
          } catch (e) {
            console.warn('Unknown item id', id);
          }
          const clone = SkeletonUtils.clone(scene, true);
          setScene(clone);
        })();
    }, [id]); // eslint-disable-line

      return scene ? 
        <primitive
          scale={[3, 3, 3]}
          rotation={[Math.PI, 0, Math.PI / 2]}
          position={position}
          object={scene}
        />
        : null;
    };
