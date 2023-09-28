import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import '@babylonjs/loaders/glTF';

import { Database, Scene, Engine } from '@babylonjs/core';
import { Inspector } from '@babylonjs/inspector';
import { zoneController } from '../controllers/ZoneController';

Database.IDBStorageEnabled = true;

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

/**
 * @type {import('@babylonjs/core/Engines/engine').Engine}
 */
let engine = null;

const RenderedZone = () => {
  const [zone, _setZone] = useState(params.zone ?? 'qeytoqrg');
  const canvasRef = useRef();

  useEffect(() => {
    if (!engine) {
      engine = new Engine(canvasRef.current, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
      engine.disableManifestCheck = true;
      engine.enableOfflineSupport = true;
    }
    zoneController.loadZoneScene(new Scene(engine), zone, canvasRef.current);
    Inspector.Show(zoneController.scene, { embedMode: true, overlay: true });

    engine.runRenderLoop(() => {
      if (zoneController.scene && zoneController.CameraController.camera) {
        zoneController.scene.render();
      }
    });
    window.addEventListener('resize', () => {
      engine.resize();
    });

    
    
  }, [zone]);

  return <div width="100%" height="100%"><canvas width="100vw" height="100vh" ref={canvasRef} id="renderCanvas"></canvas></div>;
};

export const BabylonZone = () => {
  return (
    <RenderedZone />
  );
};
