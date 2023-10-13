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
import { useToasts } from 'react-toast-notifications';
import { cameraController } from '../controllers/CameraController';

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
  const { addToast } = useToasts();
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
        if (zone === 'qeytoqrg' && params.spawns === 'true') {
          spawnController.addSpawns(mockData.filter(a => a || a.name.includes('rat') && !a.name.includes('JPE')));
        }
      }, 500);
      
    });
    if (process.env.REACT_APP_INSPECTOR === 'true') {
      Inspector.Show(zoneController.scene, { embedMode: true, overlay: true });
    }
    window.showInspector = () => {
      Inspector.Show(zoneController.scene, { embedMode: true, overlay: true });
    };
    const resizeListener = () => {
      engine.resize();
    };
   
    const keydownListener = e => {
      switch (`${e.key}`?.toLowerCase?.()) {
        case 'i': {
          if (Inspector.IsVisible) {
            Inspector.Hide();
          } else {
            Inspector.Show(zoneController.scene, { embedMode: true, overlay: true });
          }
          break;
        }
        case 'g': {
          addToast(`Gravity ${zoneController.CameraController.camera.applyGravity ? 'disabled' : 'enabled'}`, {});
          zoneController.CameraController.camera.applyGravity = !zoneController.CameraController.camera.applyGravity;
          break;
        }
        case 'c': {
          addToast(`Collision ${zoneController.CameraController.camera.checkCollisions ? 'disabled' : 'enabled'}`, {});
          zoneController.CameraController.camera.checkCollisions = !zoneController.CameraController.camera.checkCollisions;
          break;
        }
        case 'b': {
          Object.values(zoneController.SpawnController.spawns).forEach(spawn => {
            spawn.rootNode.showBoundingBox = !spawn.rootNode.showBoundingBox; spawn.rootNode.getChildMeshes().forEach(m => m.showBoundingBox = !m.showBoundingBox);
          });
          break;
        }
        case 'l': {
          const { x, y, z } = cameraController.camera.globalPosition;
          sessionStorage.setItem('cam-loc', JSON.stringify({
            x, y, z
          }));
          addToast(`Storing cam lock at x: ${x}, y: ${y}, z: ${z}`, {});

          break;
        }
        default:
          break;
      }
    };
    window.addEventListener('resize', resizeListener);
    window.addEventListener('keydown', keydownListener);
    return () => {
      engine.stopRenderLoop();
      window.removeEventListener('resize', resizeListener);
      window.addEventListener('keydown', keydownListener);

    };
    
  }, [zone, addToast]);

  return <div width="100%" height="100%"><canvas width="100vw" height="100vh" ref={canvasRef} id="renderCanvas"></canvas></div>;
};

export const BabylonZone = () => {
  return (
    <RenderedZone />
  );
};
