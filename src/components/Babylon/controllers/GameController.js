import '@babylonjs/loaders/glTF';

import { cameraController } from './CameraController';
import { lightController } from './LightController';
import { skyController } from './SkyController';
import { musicController } from './MusicController';
import { soundController } from './SoundController';
import { spawnController } from './SpawnController';
import { guiController } from './GUIController';
import { itemController } from './ItemController';
import { zoneController } from './ZoneController';
import { Engine, Matrix, Scene, Database, SceneLoader } from '@babylonjs/core';
  
import mockData from '../mockSpawns.json';
import { Inspector } from '@babylonjs/inspector';
import { GlobalStore } from '../../../state';

Database.IDBStorageEnabled = true;
SceneLoader.ShowLoadingScreen = false;

export class GameController {
  /** @type {Engine} */
  engine = null;
  /** @type {Scene} */
  #scene = null;
  /** @type {HTMLCanvasElement} */
  canvas = null;

  loading = false;

  CameraController = cameraController;
  LightController = lightController;
  SkyController = skyController;
  MusicController = musicController;
  SoundController = soundController;
  SpawnController = spawnController;
  GuiController = guiController;
  ItemController = itemController;
  ZoneController = zoneController;

  constructor() {
    this.CameraController.setGameController(this);
    this.LightController.setGameController(this);
    this.SkyController.setGameController(this);
    this.MusicController.setGameController(this);
    this.SoundController.setGameController(this);
    this.SpawnController.setGameController(this);
    this.GuiController.setGameController(this);
    this.ItemController.setGameController(this);
    this.ZoneController.setGameController(this);

    this.keyDown = this.keyDown.bind(this);
    this.resize = this.resize.bind(this);
    this.sceneClicked = this.sceneClicked.bind(this);
  }

  get currentScene() {
    return this.#scene;
  }

  loadEngine(canvas, addToast) {
    if (this.engine) {
      this.engine.dispose();
    }
    this.canvas = canvas;
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
    this.engine.disableManifestCheck = true;
    this.engine.enableOfflineSupport = true;
    this.loading = false;
    this.addToast = addToast;
  }

  resize() {
    this.engine?.resize();
  }

  async loadZoneScene (zoneName, loadSpawns) {
    this.dispose();
    if (!this.engine || !this.canvas) {
      return;
    }
    GlobalStore.actions.setLoading(true);
    this.loading = true;
    this.#scene = new Scene(this.engine);
    await this.ZoneController.loadZoneScene(this.#scene, zoneName);
    if (zoneName === 'qeytoqrg' && loadSpawns) {
      spawnController.addSpawns(mockData.filter(a => a || a.name.includes('rat') && !a.name.includes('JPE'))).then(() => {
        if (process.env.REACT_APP_INSPECTOR === 'true') {
          Inspector.Show(this.#scene, { embedMode: true, overlay: true });
        }
        GlobalStore.actions.setLoading(false);
        this.loading = false;
      });
    } else {
      if (process.env.REACT_APP_INSPECTOR === 'true') {
        Inspector.Show(this.#scene, { embedMode: true, overlay: true });
      }
      GlobalStore.actions.setLoading(false);
      this.loading = false;
    }
    this.#scene.onPointerDown = this.sceneClicked;
    this.engine.runRenderLoop(() => {
      if (this.#scene && this.CameraController.camera && !this.loading) {
        this.#scene.render();
      }
    });
  }

  keyDown(e) {
    switch (`${e.key}`?.toLowerCase?.()) {
      case 'i': {
        if (Inspector.IsVisible) {
          Inspector.Hide();
        } else {
          Inspector.Show(gameController.scene, { embedMode: true, overlay: true });
        }
        break;
      }
      case 'g': {
        this.addToast(`Gravity ${gameController.CameraController.camera.applyGravity ? 'disabled' : 'enabled'}`, {});
        gameController.CameraController.camera.applyGravity = !gameController.CameraController.camera.applyGravity;
        break;
      }
      case 'c': {
        this.addToast(`Collision ${gameController.CameraController.camera.checkCollisions ? 'disabled' : 'enabled'}`, {});
        zoneController.CameraController.camera.checkCollisions = !gameController.CameraController.camera.checkCollisions;
        break;
      }
      case 'b': {
        Object.values(gameController.SpawnController.spawns).forEach(spawn => {
          spawn.rootNode.showBoundingBox = !spawn.rootNode.showBoundingBox; spawn.rootNode.getChildMeshes().forEach(m => m.showBoundingBox = !m.showBoundingBox);
        });
        break;
      }
      case 'l': {
        const { x, y, z } = gameController.CameraController.camera.globalPosition;
        sessionStorage.setItem('cam-loc', JSON.stringify({
          x, y, z
        }));
        this.addToast(`Storing cam lock at x: ${x}, y: ${y}, z: ${z}`, {});

        break;
      }
      default:
        break;
    }
  }

  sceneClicked() {
    const ray = this.#scene.createPickingRay(this.#scene.pointerX, this.#scene.pointerY, Matrix.Identity(), this.CameraController.camera);
    const hit = this.#scene.pickWithRay(ray);
    if (hit.pickedMesh && /spawn_\d+/.test(hit.pickedMesh.id)) {
      const [, id] = hit.pickedMesh.id.split('_');
      window.spawn = this.SpawnController.spawns[id];
      window.setTargetName?.(window.spawn.spawn.displayedName);
      console.log('Mesh clicked', hit.pickedMesh);
    }
  }

  dispose() {
    if (this.scene) {
      this.scene.dispose();
    }

    this.CameraController.dispose();
    this.LightController.dispose();
    this.SkyController.dispose();
    this.MusicController.dispose();
    this.SoundController.dispose();
    this.SpawnController.dispose();
    this.ItemController.dispose();
    this.ZoneController.dispose();
  }

}

export const gameController = new GameController();
window.gameController = gameController;