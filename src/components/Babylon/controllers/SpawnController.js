import { AbstractMesh, PhysicsAggregate, PhysicsShapeType, SceneLoader, Tools, Vector3 } from '@babylonjs/core';
import { PointOctree } from 'sparse-octree';
import { Vector3 as ThreeVector3 } from 'three';
import { TextBlock } from '@babylonjs/gui';

import raceData from '../../../common/raceData.json';
import { eqtoBabylonVector } from '../../../util/vector';
import { Spawn } from '../models/Spawn';
import { guiController } from './GUIController';


const modelsUrl = 'https://eqrequiem.blob.core.windows.net/assets/models/';

/**
 * @typedef {import('@babylonjs/core').AssetContainer} AssetContainer
 */
class SpawnController {
  /**
   * @type {import('@babylonjs/core/scene').Scene} scene
   */
  #scene = null;

  /**
   * @type {Object.<number, { spawn: import('../models/Spawn').Spawn, nameplateAnchor: import('@babylonjs/core/Meshes').Mesh, rootNode: import('@babylonjs/core/Meshes').Mesh, physicsAggregate: PhysicsAggregate, animationGroups: Array<AnimationGroup>, nameplate: TextBlock}>}
   */
  spawns = {};

  /**
   * @type {Object.<string, Promise<AssetContainer>}
   */
  assetContainers = {};

  /**
   * @type {PointOctree}
   */
  octree = null;

  /**
   * @type {number}
   */
  spawnCullCounter = 0;

  /**
   * @type {number}
   */
  spawnCullRange = 750;

  dispose() {
    this.assetContainers = {};
    this.spawns = {};
  }

  setupSpawnController (scene, aabbTree) {
    this.#scene = scene;

    const { min, max } = aabbTree;
    this.octree = new PointOctree(new ThreeVector3(min.x, min.y, min.z), new ThreeVector3(max.x, max.y, max.z));
    
  } 

  /**
   * 
   * @param {string} modelName 
   * @returns {Promise<AssetContainer>}
   */
  getAssetContainer(modelName) {
    if (!this.assetContainers[modelName]) {
      this.assetContainers[modelName] = SceneLoader.LoadAssetContainerAsync(modelsUrl, `${modelName}.glb.gz`, this.#scene, undefined, '.glb');
    }
    return this.assetContainers[modelName];
  }

  async addSpawn(modelName, models) {
    const container = await this.getAssetContainer(modelName);

    if (!container) { 
      console.log('Did not load model', modelName);
      return;
    }

    for (const [_idx, spawnEntry] of Object.entries(models)) {
      const { x, y, z, spawn_id: id, name } = spawnEntry;
      const instanceContainer = container.instantiateModelsToScene();
      const rootNode = instanceContainer.rootNodes[0];

      if (!rootNode) {
        console.log('No root node for container spawn', instanceContainer, spawnEntry);
        return;
      }

      rootNode.id = `spawn_${id}`;
      rootNode.name = name;
      instanceContainer.animationGroups?.[0]?.play(true);

      const scale = spawnEntry.size / 3;
      rootNode.scaling.z = scale;
      rootNode.scaling.x = scale;
      rootNode.scaling.y = scale;
      const height = rootNode.getHierarchyBoundingVectors().max.y - rootNode.getHierarchyBoundingVectors().min.y;
      rootNode.position = eqtoBabylonVector(x, y, z + 5);
      rootNode.rotation = new Vector3(Tools.ToRadians(0), Tools.ToRadians(180) + Tools.ToRadians(spawnEntry.heading), Tools.ToRadians(0));
      
      const ag = new PhysicsAggregate(rootNode, PhysicsShapeType.BOX, { center: new Vector3(0, 1, 0), extents: new Vector3(2, height, 2), mass: 1, restitution: 0, friction: 1 });
      ag.body.setMassProperties({
        inertia: new Vector3(0, 0, 0)
      });
      rootNode.setEnabled(false);
      rootNode.isPickable = true;

      for (const mesh of rootNode.getChildMeshes()) {
        mesh.checkCollisions = true;
        mesh.name = mesh.material.name;

        mesh.metadata = {
          spawn: true,
        };
      }

      const nameplate = new TextBlock(`spawn_${id}_nameplate`, name);
      nameplate.color = 'teal';
      nameplate.fontFamily = 'arial';
      nameplate.fontSize = 20;
      guiController.manager.addControl(nameplate);
      nameplate.linkOffsetYInPixels = -30;
      nameplate.isVisible = false;

      this.spawns[id] = {
        spawn           : new Spawn(spawnEntry),
        rootNode,
        physicsAggregate: ag,
        animationGroups : instanceContainer.animationGroups,
        nameplate,
      };

      this.updateTextures(id);
      this.calculateNameplate(id, true);
      
      const vec = new ThreeVector3(rootNode.absolutePosition.x, rootNode.absolutePosition.y, rootNode.absolutePosition.z);
      if (this.octree.get(vec)) {
        this.octree.set(vec, [...this.octree.get(vec), id]);
      } else {
        this.octree.set(vec, [id]);
      }
    }
  }

  updateTextures(id) {
    const spawn = this.spawns[id];
    const model = spawn.spawn.model;
    if (model === '') {
      return;
    }
    const isVariation = (name, variation) => {
      if (/\d{4}$/.test(name)) {
        return name.slice(name.length - 4, name.length - 2) === `${variation}`.padStart(2, '0');
      }
      return false;
    };
    const matchPrefix = (prefix, name) => {
      return name.includes(prefix);
    };
    for (const mesh of spawn.rootNode.getChildMeshes()) {
      // NPCs without equipment
      if (!spawn.spawn.hasEquip) {
        const texture = spawn.spawn.equipChest;
        if (isVariation(mesh.name, texture)) {
          mesh.setEnabled(true);
        } else {
          mesh.setEnabled(false);
        }
      } else {
        // Humanoid wearing equip
        const equip = spawn.spawn.equipment;
        // One-offs for helm
        if (mesh.name.includes('helm')) {
          if (!mesh.name.endsWith(equip.head.id)) {
            mesh.setEnabled(false);
          } else {
            mesh.setEnabled(true);
          }
        }

        if (mesh.name.includes('chain') && equip.head.id !== 2) {
          mesh.setEnabled(false);
        }
        if (mesh.name.includes('leather') && equip.head.id !== 1) {
          mesh.setEnabled(false);
        }

        // Disable all clk for now
        if (mesh.name.startsWith('d_clk')) {
          mesh.setEnabled(false);
        }

        // Chest
        if (matchPrefix(`${model}ch`, mesh.name)) {
          mesh.setEnabled(isVariation(mesh.name, equip.head.id));
        }

        // Face
        if (matchPrefix(`${model}he00`, mesh.name) && /[0-9]1$/.test(mesh.name)) {
          mesh.setEnabled(mesh.name.endsWith(`${spawn.spawn.face}1`));
        }

        // Hands
        if (matchPrefix(`${model}hn`, mesh.name)) {
          if (!isVariation(mesh.name, 0)) {
            mesh.setEnabled(isVariation(mesh.name, equip.hands.id));
          }
        }

        // Arms
        if (matchPrefix(`${model}ua`, mesh.name)) {
          mesh.setEnabled(isVariation(mesh.name, equip.arms.id));
        }

        // Bracers
        if (matchPrefix(`${model}fa`, mesh.name)) {
          mesh.setEnabled(isVariation(mesh.name, equip.wrist.id));
        }
        
        // Legs
        if (matchPrefix(`${model}lg`, mesh.name)) {
          mesh.setEnabled(isVariation(mesh.name, equip.legs.id));
        }

        // Feet
        if (matchPrefix(`${model}ft`, mesh.name)) {
          mesh.setEnabled(isVariation(mesh.name, equip.feet.id));
        }
      }
    }
  }

  calculateNameplate(id, bypassEnabled = false) {
    const spawn = this.spawns[id];
    let nameplateAnchor = spawn.rootNode;
    let maxY = 0;
    for (const mesh of spawn.rootNode.getChildMeshes()) {
      mesh.refreshBoundingInfo(true, true);
      if ((bypassEnabled || mesh.isEnabled()) && mesh.getBoundingInfo().boundingBox.maximum.y > maxY) {
        maxY = mesh.getBoundingInfo().boundingBox.maximum.y;
        nameplateAnchor = mesh;
      }
    }
    spawn.nameplate.text = spawn.spawn.displayedName;
    spawn.nameplate.linkWithMesh(nameplateAnchor);
    spawn.nameplateAnchor = nameplateAnchor;
    spawn.nameplateAnchor.occlusionQueryAlgorithmType = AbstractMesh.OCCLUSION_ALGORITHM_TYPE_ACCURATE;
    spawn.nameplateAnchor.occlusionType = AbstractMesh.OCCLUSION_TYPE_STRICT;
    spawn.nameplateAnchor.forceRenderingWhenOccluded = true;
  }

  calculateNameplateOffset(id, distance) {
    const spawn = this.spawns[id];
    if (distance < 200) {
      if (spawn.nameplateAnchor.isOccluded) {
        spawn.nameplate.isVisible = false;
        return;
      }
      if (!spawn.nameplate.isVisible) {
        spawn.rootNode.getChildMeshes().forEach(m => m.refreshBoundingInfo(true, true));
      }
      const dist = (200 - distance) / 5;
      spawn.nameplate.isVisible = true;
      spawn.nameplate.fontSize = window.devicePixelRatio * Math.max(10, 25 - (distance / 8));
      spawn.nameplate.linkOffsetYInPixels = -15 - dist - (30 / (distance / 10));
    } else {
      spawn.nameplate.isVisible = false;
    }
  }

  startIdleAnimations(id, distance) {
    if (distance < 200) {
      const spawn = this.spawns[id];
      spawn.animationGroups[0]?.play(true);
    }
  }

  async addSpawns (spawns) {
    const spawnList = {};
    for (const spawn of spawns) {
      const model = raceData.find(r => r.id === spawn.race);
      const realModel = (model[spawn.gender] || model['2'] || 'HUM').toLowerCase();
      if (!spawnList[realModel]) {
        spawnList[realModel] = [];
      }
      spawnList[realModel].push(spawn);
    }

    for (const [modelName, models] of Object.entries(spawnList)) {
      this.addSpawn(modelName, models);
    }
  }

  updateSpawns(position) {
    const perf = performance.now();

    const threePosition = new ThreeVector3(position.x, position.y, position.z);
    const pts = [];
    for (const res of this.octree.findPoints(threePosition, this.spawnCullRange)) {
      pts.push({ distance: res.distance, spawns: res.data });
      for (const id of res.data) {
        const spawn = this.spawns[id];
        if (!spawn.rootNode.isEnabled()) {
          spawn.rootNode.setEnabled(true);
          this.calculateNameplate(id);
        }
        this.startIdleAnimations(id, res.distance);
        this.calculateNameplateOffset(id, res.distance);
      }
    }
    window.points = pts;
    this.spawnCullCounter++;
    if (this.spawnCullCounter % 240 === 0) {
      this.spawnCullCounter = 0;
      for (const res of this.octree.findPoints(threePosition, Infinity)) {
        if (res.distance > (this.spawnCullRange)) {
          for (const id of res.data) {
            const spawn = this.spawns[id];
            if (spawn.rootNode.isEnabled()) {
              spawn.rootNode.setEnabled(false);
            }
            if (spawn.nameplate.isVisible) {
              spawn.nameplate.isVisible = false;
            }
          }
        }
        if (res.distance > 200) {
          for (const id of res.data) {
            const spawn = this.spawns[id];
            for (const animationGroup of spawn.animationGroups) {
              animationGroup.stop();
            }
          }
        }
      }
    }
    if (window.spawnPerf === undefined) {
      window.spawnPerf = 0;
    }
    window.spawnPerf += performance.now() - perf;
  }
}

export const spawnController = new SpawnController();