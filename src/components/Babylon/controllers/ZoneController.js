
import { SceneLoader, Vector3,
  SceneOptimizer, SceneOptimizerOptions, SceneSerializer,
  Tools, Texture, HavokPlugin } from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';
  
import { getDataEntry, setDataEntry } from '../../../services/idb';
import { textureAnimationMap } from './textureAnimationMap';
import { cameraController } from './CameraController';
import { lightController } from './LightController';
import { skyController } from './SkyController';
  
const sceneVersion = 1;
const storageUrl = 'https://eqrequiem.blob.core.windows.net/assets/zones/';
const objectsUrl = 'https://eqrequiem.blob.core.windows.net/assets/objects/';
const textureUrl = 'https://eqrequiem.blob.core.windows.net/assets/textures/';
  
async function getInitializedHavok() {
  return await HavokPhysics();
}
  
const assumedFramesPerSecond = 60;
const earthGravity = -9.81;

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
  collideCounter = 0;
  lastPosition = new Vector3(0, 0, 0);
  CameraController = cameraController;
  LightController = lightController;
  SkyController = skyController;

  dispose() {
    if (this.scene) {
      this.scene.dispose();
    }

    this.CameraController.dispose();
    this.LightController.dispose();
    this.SkyController.dispose();
  }

  async loadZoneScene (scene, zoneName, canvas) {
    this.dispose();
    this.scene = scene;
    this.zoneName = zoneName;
    this.scene.metadata = { version: sceneVersion };
    this.scene.collisionsEnabled = true;
    this.scene.gravity = new Vector3(0, earthGravity / assumedFramesPerSecond, 0);
    this.CameraController.createCamera(scene, canvas);
    if (!await this.loadPhysicsEngine) {
      console.error('Could not load physics engine');
      return;
    }
    this.scene._physicsEngine.gravity = scene.gravity;

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

    // Zone texture
    await this.loadZoneTexture();

    this.zoneMetadata = await fetch(`${storageUrl}${zoneName}.json`).then(r => r.json());


    // Objects
    if (!this.hadStoredScene) {
      await Promise.all(Object.entries(this.zoneMetadata.objects).map(([key, val]) => this.instantiateObjects(key, val)));
    } else {
      scene.meshes.filter(m => m.metadata?.zoneObject).forEach(mesh => {
        mesh.freezeWorldMatrix();
      });
      for (const [key, val] of Object.entries(this.zoneMetadata.objects).filter(([key]) =>
        scene.metadata.animatedMeshes.includes(key))) {
        await this.instantiateObjects(key, val);
      }
    }

    // Lights
    this.LightController.loadLights(scene, this.zoneMetadata.lights, this.hadStoredScene);

    // Sky 
    await this.SkyController.loadSky(scene, 1, this.hadStoredScene);

    // Set up aabb tree
    await this.setupAabbTree();

    // Start zone hook
    this.collideCounter = 0;
    this.lastPosition = { ...cameraController.camera.position };
    this.scene.onAfterRenderObservable.add(this.renderHook.bind(this));

    // Optimize
    SceneOptimizer.OptimizeAsync(scene, SceneOptimizerOptions.ModerateDegradationAllowed());

    // Start texture animations
    await this.addTextureAnimations();

    // Start object animations
    scene.animationGroups.forEach(a => a.play(true));

    // Serialize in background
    this.serializeScene();

  }

  renderHook() {
    if (this.CameraController.camera.globalPosition.equals(this.lastCameraPosition)) {
      return;
    }
    this.lastCameraPosition = { ...this.CameraController.camera.globalPosition };

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
  
    this.collideCounter++;
    if (this.collideCounter % 20 === 0) {
      this.collideCounter = 0;
      // Lights on/off
      const sortedLights = this.LightController.zoneLights.sort((a, b) =>
        Vector3.Distance(a.position, this.lastCameraPosition) >
            Vector3.Distance(b.position, this.lastCameraPosition) ? 1 : -1);
  
      for (const light of sortedLights.slice(0, 8)) {
        light.setEnabled(true);
      }
      for (const light of sortedLights.slice(8, this.LightController.zoneLights.length)) {
        light.setEnabled(false);
      }
  
    }
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
        material.freeze();
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
    const zoneRegionMeshes = [];
    for (const mesh of zoneRoot.getChildMeshes()) {
      if (mesh.metadata?.gltf?.extras) {
        const extras = mesh.metadata?.gltf?.extras;
        zoneRegionMeshes.push({ mesh, extras });
      }
      mesh.checkCollisions = true;
      mesh.freezeWorldMatrix();
      mesh.scaling.z = 1;
    }
    setTimeout(() => {
      zoneRegionMeshes.forEach(({ mesh }) => mesh.setEnabled(false));
    }, 20);

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
    const havokPlugin = new HavokPlugin(true, HK);
    havokPlugin.setGravity(new Vector3(0, earthGravity / assumedFramesPerSecond, 0));
    return this.scene.enablePhysics(new Vector3(0, earthGravity / assumedFramesPerSecond, 0), havokPlugin);
  }

  async instantiateObjects (modelName, model) {
    const container = await SceneLoader.LoadAssetContainerAsync(objectsUrl, `${modelName}.glb.gz`, this.scene, undefined, '.glb');
    for (const [idx, v] of Object.entries(model)) {
      const [x, y, z] = v.pos;
      const [rotX, rotY, rotZ] = v.rot;
      const c = container.instantiateModelsToScene(() => `${modelName}_${idx}`);
      const hasAnimations = c.animationGroups.length > 0;
      for (const mesh of c.rootNodes[0].getChildMeshes()) {
        mesh.position = new Vector3(-1 * x, y, z);
        mesh.rotation = new Vector3(Tools.ToRadians(rotX), Tools.ToRadians(180) + Tools.ToRadians(-1 * rotY), Tools.ToRadians(rotZ));
        mesh.checkCollisions = true;
        mesh.scaling.z = 1;
        mesh.metadata = {
          animated  : hasAnimations,
          zoneObject: true,
        };
        mesh.id = `${modelName}_${idx}`;
        if (!hasAnimations) {
          mesh.freezeWorldMatrix();
        }
      }
    }
  }

  async setupAabbTree() {
    const aabb = await fetch(`${storageUrl}${this.zoneName}/aabb_tree_pruned.json`).then(a => a.json()).catch(e => ({}));
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
