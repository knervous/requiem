import React, {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import raceData from '../../common/raceData.json';

import {
  Model,
} from 'react-babylonjs';
import {
  Vector3
} from '@babylonjs/core';
import { getCachedTexture } from './hooks/useCachedTexture';



const storageUrl = 'https://mqbrowser.blob.core.windows.net/zones/models/';

export const RenderedSpawn = ({ spawn, scene, cameraPosition }) => {
  const model = useMemo(() => {
    const model = raceData.find(r => r.id === spawn.race);
    return (model[spawn.gender] || model['2'] || 'HUM').toLowerCase();
  }, [spawn.race, spawn.gender]);
  const [babylonModel, setBabylonModel] = useState(null);
  const [doRender, setDoRender] = useState(
    Vector3.Distance(cameraPosition, new Vector3(spawn.y, spawn.z, spawn.x)) <
      300
  );

  useEffect(() => {
    if (babylonModel) {
      if (doRender) {
        babylonModel.unfreezeWorldMatrix();
        babylonModel.setEnabled(true);
        console.log('Enabling', spawn.name);
        console.log('model', babylonModel);
      } else {
        babylonModel.freezeWorldMatrix();
        scene.stopAnimation(babylonModel);
        babylonModel.setEnabled(false);
        console.log('Disabling', spawn.name);
      }
    } 
  }, [babylonModel, doRender, scene, spawn.name]);

  useEffect(() => {
    setDoRender(
      Vector3.Distance(cameraPosition, new Vector3(spawn.y, spawn.z, spawn.x)) <
        300
    );
  }, [cameraPosition, spawn.y, spawn.x, spawn.z]);

  const onCreated = model => {
  
    setBabylonModel(model);
  };

  useEffect(() => {
    (async () => {
      // const asset = await getCachedTexture(storageUrl, model);
      // console.log(`Got asset for ${spawn.name}`, asset);
    })();
    
  }, []);

  return (
    <Suspense fallback={null}>
      <Model
        onCreated={onCreated}
        scaleToDimension={50}
        checkCollisions
        rootUrl={storageUrl}
        sceneFilename={`${model}.glb`}
        name={spawn.name}
        position={new Vector3(spawn.y, spawn.z, spawn.x)}
      ></Model>
    </Suspense>
  );
};
