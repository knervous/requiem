
import { SceneLoader, Vector3,
  SceneOptimizer, SceneOptimizerOptions, SceneSerializer,
  Tools, Texture, HavokPlugin, PhysicsAggregate, PhysicsShapeType } from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';
import { Vector3 as ThreeVector3 } from 'three';
import { PointOctree } from 'sparse-octree';


import { getDataEntry, setDataEntry } from '../../../services/idb';
import { textureAnimationMap } from './textureAnimationMap';
import { cameraController } from './CameraController';
import { lightController } from './LightController';
import { skyController } from './SkyController';
import { musicController } from './MusicController';
import { soundController } from './SoundController';
import { spawnController } from './SpawnController';
import { guiController } from './GUIController';

const sceneVersion = 1;
const objectAnimationThreshold = 10;
const storageUrl = 'https://eqrequiem.blob.core.windows.net/assets/zones/';
const objectsUrl = 'https://eqrequiem.blob.core.windows.net/assets/objects/';
const textureUrl = 'https://eqrequiem.blob.core.windows.net/assets/textures/';

async function getInitializedHavok() {
  return await HavokPhysics();
}
  
const testNode = (node, point) => {
  if (!node?.min || !node?.max) {
    return false;
  }
  const { min, max } = node;
  return point.x >= min.x &&
      point.y >= min.z &&
      point.z >= min.y &&
      point.x <= max.x &&
      point.y <= max.z &&
      point.z <= max.y;
};

const recurseNodeForRegion = (node, position) => {
  if (testNode(node, position)) {
    if (testNode(node.left, position)) {
      return recurseNodeForRegion(node.left, position);
    } else if (testNode(node.right, position)) {
      return recurseNodeForRegion(node.right, position);
    }
    return node;
  }
  return null;
};

const recurseTreeFromKnownNode = (node, position) => {
  while (node && !testNode(node, position)) {
    node = node.parent;
  }
  return recurseNodeForRegion(node, position);
};

  
class ZoneController {
  /**
 * @type {import('@babylonjs/core/scene').Scene}
 */
  scene = null;
  hadStoredScene = false;
  zoneName = '';
  zoneMetadata = {};
  aabbTree = {};
  animatedMeshes = [];
  animationGroupMap = {};
  collideCounter = 0;
  objectAnimationPlaying = [];
  lastPosition = new Vector3(0, 0, 0);
  CameraController = cameraController;
  LightController = lightController;
  SkyController = skyController;
  MusicController = musicController;
  SoundController = soundController;
  SpawnController = spawnController;
  GuiController = guiController;

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
  }

  async loadZoneScene (scene, zoneName, canvas) {
    this.dispose();
    this.scene = scene;
    this.zoneName = zoneName;
    this.scene.metadata = { version: sceneVersion };
    this.scene.collisionsEnabled = true;
    // this.scene.performancePriority = ScenePerformancePriority.Intermediate;
    this.CameraController.createCamera(scene, canvas);

    // Load serialized scene in IDB
    let storedScene = await getDataEntry(zoneName);
    if (storedScene) {
      if (storedScene.data.metadata?.version === sceneVersion) {
        const { animatedMeshes } = storedScene.data.metadata;
        delete storedScene.data.metadata;
        scene.metadata.animatedMeshes = animatedMeshes;
        await SceneLoader.AppendAsync('', `data:${JSON.stringify(storedScene.data)}`, scene);
        this.hadStoredScene = true;
      } else {
        storedScene = null;
      }
    }

    this.scene.gravity = new Vector3(0, -0.6, 0);
    console.log('hello');
    if (!(await this.loadPhysicsEngine())) {
      console.error('Could not load physics engine');
      return;
    }

    // Zone texture
    await this.loadZoneTexture();

    this.zoneMetadata = await fetch(`${storageUrl}${zoneName}.json`).then(r => r.json());

    
    // Objects
    if (!this.hadStoredScene) {
      this.animatedMeshes = (await Promise.all(Object.entries(this.zoneMetadata.objects).filter(([, val]) => val?.[0]?.animated).map(([key, val]) => this.instantiateObjects(key, val)))).flat();
    } else {
      for (const [key, val] of Object.entries(this.zoneMetadata.objects).filter(([key]) =>
        scene.metadata.animatedMeshes.includes(key))) {
        this.animatedMeshes = this.animatedMeshes.concat(await this.instantiateObjects(key, val));
      }
    }

    scene.meshes.filter(m => m.metadata?.zoneObject).forEach(mesh => {
      mesh.freezeWorldMatrix();
    });

    // Set up aabb tree
    await this.setupAabbTree();

    // Music
    this.MusicController.hookUpZoneMusic(scene, this.zoneName, this.zoneMetadata.music, this.aabbTree);

    // Sound
    this.SoundController.hookUpZoneSounds(scene, this.zoneMetadata.sound2d, this.zoneMetadata.sound3d);

    scene.audioListenerPositionProvider = () => this.CameraController.camera.globalPosition;

    // Lights
    this.LightController.loadLights(scene, this.zoneMetadata.lights, this.hadStoredScene, this.aabbTree);

    // Sky 
    await this.SkyController.loadSky(scene, 1, this.hadStoredScene);

    // Spawn controller
    this.SpawnController.setupSpawnController(scene, this.aabbTree);

    // GUI controller
    this.GuiController.setupGuiController(scene);

    // Start zone hook
    this.collideCounter = 0;
    this.lastPosition = { ...cameraController.camera.position };

    this.scene.onAfterRenderObservable.add(this.renderHook.bind(this));

    // Optimize
    SceneOptimizer.OptimizeAsync(scene, SceneOptimizerOptions.ModerateDegradationAllowed());

    // Start texture animations
    await this.addTextureAnimations();

    // Serialize in background
    this.serializeScene();
    this.counter = 0;

    this.octree = new PointOctree(new ThreeVector3(this.aabbTree.min.x, this.aabbTree.min.z, this.aabbTree.min.y), 
      new ThreeVector3(this.aabbTree.max.x, this.aabbTree.max.z, this.aabbTree.max.y));

    this.scene.getMeshByName('__zone__').getChildMeshes().concat(this.animatedMeshes).forEach((mesh) => {
      if (mesh.parent?.metadata?.gltf?.extras?.zoneMesh) {
        return;
      }
      const { x, y, z } = mesh.absolutePosition || mesh.position;
      mesh.setEnabled(false);
      const vec = new ThreeVector3(x, y, z);
      if (this.octree.get(vec)) {
        this.octree.set(vec, [...this.octree.get(vec), mesh]);
      } else {
        this.octree.set(vec, [mesh]);
      }
    });

    const result = this.octree.findPoints(this.CameraController.camera.globalPosition, 1500);
    for (const res of result) {
      for (const mesh of res.data) {
        mesh.setEnabled(true);
      }
    }

    this.counter = 0;
    this.cullCounter = 0;
    window.perf = 0;
  }

  renderHook() {
    if (this.CameraController.camera.globalPosition.equals(this.lastCameraPosition)) {
      return;
    }
    this.lastCameraPosition = { ...this.CameraController.camera.globalPosition };
    this.counter++;
    this.cullCounter++;
    const perf = performance.now();
    const threePosition = new ThreeVector3(this.lastCameraPosition._x, this.lastCameraPosition._y, this.lastCameraPosition._z);

    if (this.cullCounter % 240 === 0) {
      this.cullCounter = 0;
      for (const res of this.octree.findPoints(threePosition, Infinity)) {
        if (res.distance > (2000)) {
          for (const mesh of res.data) {
            if (mesh.isEnabled()) {
              mesh.setEnabled(false);
            }
          }
        }
        if (res.distance > 200) {
          for (const mesh of res.data) {
            if (this.animationGroupMap[mesh.id]) {
              this.animationGroupMap[mesh.id].forEach(ag => {
                if (this.objectAnimationPlaying.includes(ag)) {
                  this.objectAnimationPlaying = this.objectAnimationPlaying.filter(o => o !== ag);
                  ag.stop();
                }
              });
            }
          }
        }
      }
    }
    if (this.counter % 20 === 0) {
      this.counter = 0;
      for (const res of this.octree.findPoints(threePosition, 2000)) {
        for (const mesh of res.data) {
          if (!mesh.isEnabled()) {
            mesh.setEnabled(true);
          }
        }
      }

      for (const res of this.octree.findPoints(threePosition, 200)) {
        for (const mesh of res.data) {
          if (this.animationGroupMap[mesh.id] && this.objectAnimationPlaying.length <= objectAnimationThreshold) {
            this.animationGroupMap[mesh.id].forEach(ag => {
              this.objectAnimationPlaying.push(ag);
              ag.play(true);
            });
          }
        }
      }
    }
    window.perf += performance.now() - perf;
    const aabbRegion = recurseTreeFromKnownNode(this.lastAabbNode || this.aabbTree, this.CameraController.camera.globalPosition);
    
    if (aabbRegion) {
      this.lastAabbNode = aabbRegion;
      if (aabbRegion.regions?.includes(4)) {
        console.log(`Hit zoneline or teleporter!
                                ${JSON.stringify({ zone: aabbRegion.zone }, null, 4)}`);
      } else if (aabbRegion.regions?.includes(1)) {
        console.log('Hit water!');
      } else if (aabbRegion.regions.includes(3)) {
        console.log('Hit pvp zone');
      }
    }

    this.LightController.updateLights(this.CameraController.camera.globalPosition);
    this.MusicController.updateMusic(this.CameraController.camera.globalPosition);
    this.SpawnController.updateSpawns(this.CameraController.camera.globalPosition);
  }

  async addTextureAnimations() {

    const addTextureAnimation = (material, textureAnimation) => {
      const [baseTexture] = material.getActiveTextures();
      return Array.from({ length: textureAnimation.frames }, (_, idx) => {
        const id = material.id.replace(/d_/, '');
        const newName = `${id.slice(0, id.length - 1)}${idx + 1}`;
        const url = `${textureUrl}${newName}.png`;
        return new Texture(
          url,
          this.scene,
          baseTexture.noMipMap,
          baseTexture.invertY,
          baseTexture.samplingMode,
        );
      });
    };

    let animationTimerMap = {};
    const animationTexturesCache = {};

    for (const material of this.scene.materials) {
      const textureAnimation = textureAnimationMap[material.id];
      if (textureAnimation) {
        let allTextures;
        if (animationTexturesCache[material.id]) {
          allTextures = animationTexturesCache[material.id];
        } else {
          allTextures = await addTextureAnimation(material, textureAnimation);
          animationTexturesCache[material.id] = allTextures;
        }
        animationTimerMap = {
          ...animationTimerMap,
          [textureAnimation.time]: {
            ...(animationTimerMap[textureAnimation.time] ?? {}),
            materials: [
              ...(animationTimerMap[textureAnimation.time]?.materials ?? []),
              {
                frames      : textureAnimation.frames,
                currentFrame: 1,
                allTextures,
                material
              }
            ]
          }
        };
      } else {
        // material.freeze();
      }
    }


    for (const [time, value] of Object.entries(animationTimerMap)) {
      const interval = setInterval(() => {
        for (const material of value.materials) {
          material.currentFrame = material.currentFrame + 1 > material.frames ? 1 : material.currentFrame + 1;
          for (const texture of material.material.getActiveTextures()) {
            if (material.allTextures[material.currentFrame - 1]) {
              texture._texture = material.allTextures[material.currentFrame - 1]._texture;
            }
          }
        }
      }, +time);

      for (const material of value.materials) {
        material.material.onDisposeObservable.add(() => {
          clearInterval(interval);
        });
      }
    }

  }

  async serializeScene() {
    if (!this.hadStoredScene) {
      const serializedScene = await SceneSerializer.SerializeAsync(this.scene);
      serializedScene.cameras = [];
      serializedScene.animationGroups = [];
      serializedScene.skeletons = [];
      const [nonAnimated, animated] = serializedScene.meshes.reduce((acc, val) => {
        if (val?.metadata?.animated) {
          acc[1].push(val);
        } else {
          acc[0].push(val);
        }
        return acc;
      }, [[], []]);
      serializedScene.meshes = nonAnimated;
      serializedScene.metadata.animatedMeshes = Array.from(new Set(animated.map(a => a.name.split('_')[0])));
      setDataEntry(this.zoneName, serializedScene);
    }
  }

  async loadZoneTexture () {
    let zoneRoot;
    if (!this.hadStoredScene) {
      const texture = await SceneLoader.ImportMeshAsync(
        '',
        storageUrl,
          `${this.zoneName}.glb.gz`,
          this.scene,
          undefined,
          '.glb'
      );
      zoneRoot = texture.meshes[0];
    } else {
      zoneRoot = this.scene.getMeshByName('__zone__');
    }

    zoneRoot.name = '__zone__';
    for (const mesh of zoneRoot.getChildMeshes()) {
      mesh.checkCollisions = true;
      new PhysicsAggregate(mesh, PhysicsShapeType.MESH, { mass: 0, restitution: 0, friction: 1 });
      mesh.freezeWorldMatrix();
      mesh.isPickable = false;
      mesh.doNotSyncBoundingInfo = true;
      mesh.scaling.z = 1;
    }

    const recurse = (node) => {
      const matOutliers = ['t75_rea1', 't50_w1', 'd_w1'];
    
      if (matOutliers.includes(node.material?.name)) {
        node.checkCollisions = false;
      }
      if (node._children) {
        node._children.forEach(recurse, node.checkCollisions);
      }
    };
    recurse(zoneRoot);
    return zoneRoot;
  }

  async loadPhysicsEngine() {
    const HK = await getInitializedHavok();
    const havokPlugin = window.hp = new HavokPlugin(true, HK);
    const didEnable = this.scene.enablePhysics(new Vector3(0, -1.3, 0), havokPlugin);
    return didEnable;
  }

  async instantiateObjects (modelName, model) {
    const animatedMeshes = [];
    const container = await SceneLoader.LoadAssetContainerAsync(objectsUrl, `${modelName}.glb.gz`, this.scene, undefined, '.glb');
    for (const [idx, v] of Object.entries(model)) {
      const [x, y, z] = v.pos;
      const [rotX, rotY, rotZ] = v.rot;
      const c = container.instantiateModelsToScene(() => `${modelName}_${idx}`, undefined, { doNotInstantiate: true });
      const hasAnimations = c.animationGroups.length > 0;

      for (const mesh of c.rootNodes[0].getChildMeshes()) {
        // new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 0 });
        mesh.position = new Vector3(-1 * x, y, z);
        mesh.rotation = new Vector3(Tools.ToRadians(rotX), Tools.ToRadians(180) + Tools.ToRadians(-1 * rotY), Tools.ToRadians(rotZ));
        mesh.checkCollisions = true;
        mesh.scaling.z = 1;
        mesh.metadata = {
          animated  : hasAnimations,
          zoneObject: true,
        };
        mesh.id = `${modelName}_${idx}`;
        this.animationGroupMap[mesh.id] = c.animationGroups;
        if (!hasAnimations) {
          mesh.freezeWorldMatrix();
        }
        animatedMeshes.push(mesh);
      }
    }

    return animatedMeshes;
  }

  async setupAabbTree() {
    const aabb = await fetch(`${storageUrl}${this.zoneName}_aabb_tree.json`).then(a => a.json()).catch(() => ({}));
    const addParents = node => {
      if (!node.lights) {
        node.lights = [];
      }
      if (node.left) {
        node.left.parent = node;
        addParents(node.left);
      }
      if (node.right) {
        node.right.parent = node;
        addParents(node.right);
      }
    };
    addParents(aabb);

    this.aabbTree = aabb;
  }
}

export const zoneController = new ZoneController();
window.zone = zoneController;