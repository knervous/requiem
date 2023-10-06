import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import '@babylonjs/loaders/glTF';

import { Database, Scene, Engine } from '@babylonjs/core';
import { Inspector } from '@babylonjs/inspector';
import { zoneController } from '../controllers/ZoneController';
import mockData from '../mockSpawns.json';
import { spawnController } from '../controllers/SpawnController';

Database.IDBStorageEnabled = true;

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

/**
 * @type {import('@babylonjs/core/Engines/engine').Engine}
 */
let engine = null;

if (process.env.REACT_APP_INSPECTOR === 'true') {
  window.engine = () => engine;
}

const RenderedZone = () => {
  const [zone, _setZone] = useState(params.zone ?? 'qeynos');
  const canvasRef = useRef();

  useEffect(() => {
    if (!engine) {
      engine = new Engine(canvasRef.current, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
      engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
      engine.disableManifestCheck = true;
      engine.enableOfflineSupport = true;
    }

    zoneController.loadZoneScene(new Scene(engine), zone, canvasRef.current).then(() => {
      engine.runRenderLoop(() => {
        if (zoneController.scene && zoneController.CameraController.camera) {
          zoneController.scene.render();
        }
      });
      setTimeout(() => {
        if (zone === 'qeytoqrg') {
          spawnController.addSpawns(mockData.filter(a => a || a.name.includes('gnoll') || a.name.startsWith('Tol')));
        }
      }, 500);
      
    });
    if (process.env.REACT_APP_INSPECTOR === 'true') {
      Inspector.Show(zoneController.scene, { embedMode: true, overlay: true });
    }
    window.showInspector = () => {
      Inspector.Show(zoneController.scene, { embedMode: true, overlay: true });
    };

    window.addEventListener('resize', () => {
      engine.resize();
    });
    return () => {
      engine.stopRenderLoop();
    };
    
  }, [zone]);

  return <div width="100%" height="100%"><canvas width="100vw" height="100vh" ref={canvasRef} id="renderCanvas"></canvas></div>;
};

export const BabylonZone = () => {
  return (
    <RenderedZone />
  );
};
