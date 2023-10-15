import { AbstractMesh, Color3, DynamicTexture, Mesh, MeshBuilder, ParticleSystem, PhysicsAggregate, PhysicsShapeType, Scene, SceneLoader, StandardMaterial, Tools, Vector3 } from '@babylonjs/core';
import { PointOctree } from 'sparse-octree';
import { Vector3 as ThreeVector3 } from 'three';

import raceData from '../../../common/raceData.json';
import { eqtoBabylonVector } from '../../../util/vector';
import { Spawn } from '../models/Spawn';
import { cameraController } from './CameraController';
import { itemController } from './ItemController';
import { GameControllerChild } from './GameControllerChild';

const modelsUrl = 'https://eqrequiem.blob.core.windows.net/assets/models/';

/**
 * @typedef {import('@babylonjs/core').AssetContainer} AssetContainer
 */

/**
 * @typedef {object} ZoneSpawn
 * @property {import('../models/Spawn').Spawn} spawn
 * @property {import('@babylonjs/core/Meshes').Mesh} rootNode
 * @property {import('@babylonjs/core/Meshes').Mesh} nameplateMesh
 * @property {boolean} animating
 * @property {PhysicsAggregate} physicsAggregate
 * @property {Array<AnimationGroup>} animationGroups
 */
class SpawnController extends GameControllerChild {
  /**
   * @type {import('@babylonjs/core/scene').Scene} scene
   */
  #scene = null;

  /**
   * @type {Object.<number, ZoneSpawn>}
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
  animationCullCounter = 0;

  /**
   * @type {number}
   */
  spawnCullRange = 750;

  /**
   * @type {number}
   */
  spawnAnimationRange = 750;

  /**
   * @type {number}
   */
  skipAnimCount = 0;

  dispose() {
    this.assetContainers = {};
    this.spawns = {};
  }

  setupSpawnController (scene, aabbTree) {
    this.#scene = scene;
    const { min, max } = aabbTree;
    this.octree = new PointOctree(new ThreeVector3(min.x, min.y, min.z), new ThreeVector3(max.x, max.y, max.z));
    const originalSceneAnimate = Scene.prototype.animate;
    const zoneThis = this;
    let count = 0;
    Scene.prototype.animate = function animate() {
      if (count < zoneThis.skipAnimCount) {
        count++;
        return false;
      }
      count = 0;
      return originalSceneAnimate.call(this);
    };
    const originalUpdateBoundingInfo = AbstractMesh.prototype._updateBoundingInfo; 
    AbstractMesh.prototype._updateBoundingInfo = function _updateBoundingInfo() {
      const result = originalUpdateBoundingInfo.call(this);
      if (this.onUpdateBoundingInfo) {
        this.onUpdateBoundingInfo();
      }
      return result;
    };
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

  canEquipWeapons(skeleton) {
    if (!skeleton) {
      return true;
    }
    let lpoint = false, rpoint = false;
    for (const bone of skeleton.bones) {
      if (bone.name === 'l_point') {
        lpoint = true;
      }
      if (bone.name === 'r_point') {
        rpoint = true;
      }
      if (lpoint && rpoint) {
        break;
      }
    }
    return lpoint && rpoint;
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
      instanceContainer.animationGroups?.forEach(ag => this.#scene.removeAnimationGroup(ag));
      const totalAnimatables = instanceContainer.animationGroups.reduce((acc, val) => acc + val.targetedAnimations.length, 0);
      this.#scene._activeAnimatables = this.#scene._activeAnimatables.slice(0, this.#scene._activeAnimatables.length - totalAnimatables);
      /**
       * @type {Mesh}
       */
      let rootNode = instanceContainer.rootNodes[0];

      if (!rootNode) {
        console.log('No root node for container spawn', instanceContainer, spawnEntry);
        return;
      }
  
      rootNode.id = `spawn_${id}`;
      rootNode.name = name;
  
      const scale = spawnEntry.size / 3;

      for (const mesh of rootNode.getChildMeshes()) {
        mesh.checkCollisions = true;
        mesh.name = mesh.material.name;
        mesh.metadata = {
          spawn: true,
        };
      }

      const spawn = new Spawn(spawnEntry);
      this.updateTextures(id, { rootNode, spawn, skeleton: instanceContainer.skeletons[0] }, true);
      rootNode.position.setAll(0);
      rootNode.scaling.setAll(1);
      rootNode.rotationQuaternion = null;
      rootNode.rotation.setAll(0);
      const instanceSkeleton = instanceContainer.skeletons[0];
      const skeletonRoot = rootNode.getChildren(undefined, true).find(a => a.name.includes('root'));
      const merged = Mesh.MergeMeshes(rootNode.getChildMeshes(false), false, true, undefined, false, true);
      if (merged) {
        skeletonRoot.parent = merged;
        skeletonRoot.skeleton = instanceSkeleton;
        skeletonRoot.skeleton.name = `${name}_skeleton`;
        rootNode.dispose();
        rootNode = merged;
        rootNode.skeleton = skeletonRoot.skeleton;
        rootNode.id = `spawn_${id}`;
        rootNode.name = name;
      } else {
        rootNode.skeleton = instanceSkeleton;
      }
      rootNode.setEnabled(false);
      await this.updatePrimarySecondary(id, { rootNode, spawn, skeleton: instanceSkeleton, skeletonRoot }).catch(() => {});

      rootNode.position = eqtoBabylonVector(x, y, z + 5);
      rootNode.scaling.z = scale;
      rootNode.scaling.x = scale;
      rootNode.scaling.y = Math.abs(scale);

      rootNode.rotation = new Vector3(Tools.ToRadians(0), Tools.ToRadians(180) + Tools.ToRadians(spawnEntry.heading), Tools.ToRadians(0));
      rootNode.setEnabled(false);
      rootNode.isPickable = true;

      // Overhead nameplate
      const temp = new DynamicTexture('DynamicTexture', 64, this.#scene);
      const tmpctx = temp.getContext();
      tmpctx.font = '16px Arial';
      const textWidth = tmpctx.measureText(spawn.displayedName).width + 20;
      const textureGround = new DynamicTexture(`${spawn.name}_nameplate_texture`, { width: textWidth, height: 30 }, this.#scene);   
      textureGround.drawText(spawn.displayedName, null, null, '16px Arial', 'teal', 'transparent', false, true);
      textureGround.update(false, true);
      const materialGround = new StandardMaterial(`${spawn.name}_nameplate_material`, this.#scene);

      materialGround.diffuseTexture = textureGround;
      materialGround.diffuseTexture.hasAlpha = true;
      materialGround.useAlphaFromDiffuseTexture = true;
      materialGround.emissiveColor = Color3.FromInts(100, 200, 100);
      materialGround.disableLighting = true;
      const nameplateMesh = MeshBuilder.CreatePlane(`${spawn.name}_nameplate`, { width: textWidth / 30, height: 1 }, this.#scene);
      nameplateMesh.parent = rootNode;
      nameplateMesh.billboardMode = ParticleSystem.BILLBOARDMODE_ALL;
      nameplateMesh.material = materialGround;

      materialGround.onBindObservable.add(() => {
        this.engine.alphaState.setAlphaBlendFunctionParameters(1, 0x0303 /* ONE MINUS SRC ALPHA */, 1, 0x0303 /* ONE MINUS SRC ALPHA */);
      });

      this.spawns[id] = {
        spawn,
        rootNode,
        nameplateMesh,
        animating      : false,
        animationGroups: instanceContainer.animationGroups,
      };
  
      const vec = new ThreeVector3(rootNode.absolutePosition.x, rootNode.absolutePosition.z, rootNode.absolutePosition.y);
      if (this.octree.get(vec)) {
        this.octree.set(vec, [...this.octree.get(vec), id]);
      } else {
        this.octree.set(vec, [id]);
      }
    }
  
  }

  // eslint-disable-next-line
  updateTextures(id, infSpawn = undefined, doDelete = false) {
    const spawn = infSpawn || this.spawns[id];
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
          if (doDelete) {
            mesh.dispose();
          } else {
            mesh.setEnabled(false);
          }
          
        }
      } else {
        // Humanoid wearing equip
        const equip = spawn.spawn.equipment;
        // One-offs for helm
        let offsetHeadId = equip.head.id;
        if ([1].includes(spawn.spawn.race)) {
          offsetHeadId += 1;
          if (offsetHeadId > 4) {
            offsetHeadId = 0;
          }
        }
        if (mesh.name.includes('tm_helm') && !mesh.name.endsWith(offsetHeadId)) {
          if (doDelete) {
            mesh.dispose();
          } else {
            mesh.setEnabled(false);
          }
        }

        if (mesh.name.includes('chain') && !mesh.name.endsWith(offsetHeadId)) {
          if (doDelete) {
            mesh.dispose();
          } else {
            mesh.setEnabled(false);
          }
          
        }
        if (mesh.name.includes('leather') && !mesh.name.endsWith(offsetHeadId)) {
          if (doDelete) {
            mesh.dispose();
          } else {
            mesh.setEnabled(false);
          }
          
        }

        // Disable all clk for now
        if (mesh.name.startsWith('d_clk')) {
          if (isVariation(mesh.name, equip.chest.id - 6)) {
            mesh.setEnabled(true);
            const { blue, green, red } = spawn.spawn.equipment.chest.tint;
            mesh.material.albedoColor = Color3.FromInts(red, green, blue);
          } else {
            if (doDelete) {
              mesh.dispose();
            } else {
              mesh.setEnabled(false);
            }
          }
        }

        // Chest
        if (matchPrefix(`${model}ch`, mesh.name)) {
          if (isVariation(mesh.name, equip.chest.id)) {
            mesh.setEnabled(true);
          } else {
            if (doDelete) {
              mesh.dispose();
            } else {
              mesh.setEnabled(false);
            }
          }
        }

        // Face
        if (matchPrefix(`${model}he00`, mesh.name)) {
          if (offsetHeadId > 0) {
            if (!mesh.name.endsWith(`-${offsetHeadId}`)) {
              if (doDelete) {
                mesh.dispose();
              } else {
                mesh.setEnabled(false);
              }
            } else {
              const mat = this.#scene.materials.find(m => m.name.endsWith(`${spawn.spawn.model}he00${spawn.spawn.face}1`));
              if (mat) {
                mesh.material = mat;
              }
            }
          } else if (mesh.name.endsWith(`${spawn.spawn.face}1`)) {
            mesh.setEnabled(true);
          } else {
            if (doDelete) {
              mesh.dispose();
            } else {
              mesh.setEnabled(false);
            }
          }
           
        }

        // Hands
        if (matchPrefix(`${model}hn`, mesh.name)) {
          if (!isVariation(mesh.name, 0)) {
            if (isVariation(mesh.name, equip.hands.id)) {
              mesh.setEnabled(true);
            } else {
              if (doDelete) {
                mesh.dispose();
              } else {
                mesh.setEnabled(false);
              }
            }
          }
        }

        // Arms
        if (matchPrefix(`${model}ua`, mesh.name)) {
          if (isVariation(mesh.name, equip.arms.id)) {
            mesh.setEnabled(true);
          } else {
            if (doDelete) {
              mesh.dispose();
            } else {
              mesh.setEnabled(false);
            }
          }
        }

        // Bracers
        if (matchPrefix(`${model}fa`, mesh.name)) {
          if (isVariation(mesh.name, equip.wrist.id)) {
            mesh.setEnabled(true);
          } else {
            if (doDelete) {
              mesh.dispose();
            } else {
              mesh.setEnabled(false);
            }
          }
        }
        
        // Legs
        if (matchPrefix(`${model}lg`, mesh.name)) {
          if (isVariation(mesh.name, equip.legs.id)) {
            mesh.setEnabled(true);
          } else {
            if (doDelete) {
              mesh.dispose();
            } else {
              mesh.setEnabled(false);
            }
          }
        }

        // Feet
        if (matchPrefix(`${model}ft`, mesh.name)) {
          let feetId = equip.feet.id;
          let checkEnd = false;
          if (feetId >= 10 && feetId <= 16) {
            feetId = 0;
            checkEnd = true;
          }
          if (isVariation(mesh.name, feetId) && (!checkEnd || mesh.name.endsWith('02'))) {
            mesh.setEnabled(true);
          } else {
            if (doDelete) {
              mesh.dispose();
            } else {
              mesh.setEnabled(false);
            }
          }
        }
      }
    }
  }

  async updatePrimarySecondary(id, infSpawn = undefined) {
    const spawn = infSpawn || this.spawns[id];
    if (spawn.spawn.equipment.primary.id > 0) {
      const primary = await itemController.createItem(spawn.spawn.equipment.primary.id);
      if (primary) {
        const transformNode = spawn.skeletonRoot.getChildTransformNodes().find(a => a.name.includes('r_point'));
        const primaryBone = spawn.skeletonRoot.skeleton.bones.find(b => b.name === 'r_point');
        if (primaryBone && transformNode) {
          primary.attachToBone(primaryBone);
          primary.parent = transformNode;
          primary.rotationQuaternion = null;
          primary.rotation.setAll(0);
          primary.scaling.setAll(1);
          primary.scaling.x = -1;
          primary.name = `it${spawn.spawn.equipment.primary.id}`;
          primary.skeleton = spawn.skeleton;
        }
      }
      
    }

    if (spawn.spawn.equipment.secondary.id > 0) {
      const secondary = await itemController.createItem(spawn.spawn.equipment.secondary.id);
      if (secondary) {
        const secondaryBone = spawn.skeleton.bones.find(b => b.name === 'shield_point');
        const transformNode = spawn.rootNode.getChildTransformNodes().find(a => a.name.includes('shield_point'));
        if (secondaryBone && transformNode) {
          secondary.attachToBone(secondaryBone);
          secondary.parent = transformNode;
          secondary.rotationQuaternion = null;
          secondary.rotation.setAll(0);
          secondary.scaling.setAll(-1);
          secondary.scaling.x = -1;
          secondary.name = `it${spawn.spawn.equipment.secondary.id}`;
        }
      }
      
    }
  }

  async addSpawns (spawns) {
    const spawnList = {};
    for (const spawn of spawns) {
      const model = raceData.find(r => r.id === spawn.race);
      // Invisible man and spawn controllers
      if ([127, 240].includes(model.id)) {
        continue;
      }
      const realModel = (model[spawn.gender] || model['2'] || 'HUM').toLowerCase();
      if (!spawnList[realModel]) {
        spawnList[realModel] = [];
      }
      spawnList[realModel].push(spawn);
    }
    let remainingSpawnGroups = Object.keys(spawnList).length;
    this.actions.setLoadingText(`Loading ${remainingSpawnGroups} spawn types`);
    await Promise.all(Object.entries(spawnList).map(([modelName, models]) => this.addSpawn(modelName, models).then(() => {
      this.actions.setLoadingText(`Loading ${--remainingSpawnGroups} spawn types`);
    })));
  }
  /**
   * 
   * @param {ZoneSpawn} spawn 
   */
  enableSpawn(spawn) {
    spawn.rootNode.setEnabled(true);
    spawn.rootNode.refreshBoundingInfo();
    const height = Math.abs(spawn.rootNode.getBoundingInfo().boundingBox.maximumWorld.y - spawn.rootNode.getBoundingInfo().boundingBox.minimumWorld.y);
    spawn.nameplateMesh.position.y = spawn.rootNode.getBoundingInfo().boundingBox.minimum.y - 1.2;
    if (spawn.physicsAggregate) {
      spawn.physicsAggregate.dispose();
      delete spawn.physicsAggregate;
    }
    const ag = new PhysicsAggregate(spawn.rootNode, PhysicsShapeType.BOX, { extents: new Vector3(2, height, 2), mass: 1, restitution: 0, friction: 1 });
    ag.body.setMassProperties({
      inertia: new Vector3(0, 0, 0)
    });
    spawn.physicsAggregate = ag;
    spawn.rootNode.scaling.z = Math.abs(spawn.rootNode.scaling.z) * -1;
  }

  /**
   * 
   * @param {ZoneSpawn} spawn 
   */
  disableSpawn(spawn) {
    spawn.rootNode.setEnabled(false);
    spawn.rootNode.scaling.z = Math.abs(spawn.rootNode.scaling.z);
  }

  updateSpawns(position) {
    const perf = performance.now();

    const threePosition = new ThreeVector3(position.x, position.z, position.y);
    const spawnsForAnimation = [];
    for (const res of this.octree.findPoints(threePosition, this.spawnCullRange)) {
      for (const id of res.data) {
        const spawn = this.spawns[id];
        if (cameraController.camera.isInFrustum(spawn.rootNode) && !spawn.rootNode.isEnabled()) {
          this.enableSpawn(spawn);
        } else if (!cameraController.camera.isInFrustum(spawn.rootNode) && spawn.rootNode.isEnabled()) {
          this.disableSpawn(spawn);
        }
        if (res.distance <= this.spawnAnimationRange) {
          spawnsForAnimation.push(spawn);
        }
    
        if ((!cameraController.camera.isInFrustum(spawn.rootNode)) && spawn.animating) {
          const animatables = spawn.animationGroups.map(ag => ag.animatables).flat();
          const startIdx = this.#scene._activeAnimatables.findIndex(ag => animatables[0] === ag);
          if (startIdx > -1) {
            this.#scene._activeAnimatables.splice(startIdx, animatables.length);
          }
          spawn.animating = false;
        } else if (cameraController.camera.isInFrustum(spawn.rootNode) 
          && !spawn.animating
          && res.distance <= this.spawnAnimationRange) {
          this.#scene._activeAnimatables.push(...spawn.animationGroups.map(ag => ag.animatables).flat());
          spawn.animationGroups[0]?.play(true);
          spawn.animating = true;
        }
      }
    }

    this.animationCullCounter++;
    if (this.animationCullCounter % 300 === 0) {
      this.animationCullCounter = 0;
      
    }

    this.spawnCullCounter++;
    if (this.spawnCullCounter % 240 === 0) {
      this.spawnCullCounter = 0;
      for (const res of this.octree.findPoints(threePosition, Infinity)) {
        if (res.distance > (this.spawnCullRange)) {
          for (const id of res.data) {
            const spawn = this.spawns[id];
            if (spawn.rootNode.isEnabled()) {
              this.disableSpawn(spawn);
            }
            if (spawn.animating && res.distance > this.spawnAnimationRange) {
              const animatables = spawn.animationGroups.map(ag => ag.animatables).flat();
              const startIdx = this.#scene._activeAnimatables.findIndex(ag => animatables[0] === ag);
              if (startIdx > -1) {
                this.#scene._activeAnimatables.splice(startIdx, animatables.length);
              }
              spawn.animating = false;
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



function mergeSkeleton(mesh, skeleton) {
  // pick what you want to merge
  const allChildMeshes = mesh.getChildMeshes(false);
  const merged = Mesh.MergeMeshes(allChildMeshes, false, true, undefined, undefined, true);
  if (merged) {
    // merged.name = '_MergedModel';
    merged.skeleton = skeleton;
  }

  return merged;
}

function calculateRanges(animationGroups) {
  return animationGroups.reduce((acc, ag, index) => {
    if (index === 0) {
      acc.push({ from: Math.floor(ag.from), to: Math.floor(ag.to) });
    } else {
      const prev = acc[index - 1];

      acc.push({ from: prev.to + 1, to: prev.to + 1 + Math.floor(ag.to) });
    }
    return acc;
  }, []);
}

async function bakeVertexData(mesh, ags) {
  const s = mesh.skeleton;
  const boneCount = s.bones.length;
  /** total number of frames in our animations */
  const frameCount = ags.reduce((acc, ag) => acc + (Math.floor(ag.to) - Math.floor(ag.from)) + 1, 0);

  // reset our loop data
  let textureIndex = 0;
  const textureSize = (boneCount + 1) * 4 * 4 * frameCount;
  const vertexData = new Float32Array(textureSize);
  // mesh.refreshBoundingInfo(true, true);
  function* captureFrame() {

    const skeletonMatrices = s.getTransformMatrices(mesh);
    vertexData.set(skeletonMatrices, textureIndex * skeletonMatrices.length);
  }

  let ii = 0;
  for (const ag of ags) {
    ag.reset();
    const from = Math.floor(ag.from);
    const to = Math.floor(ag.to);
    for (let frameIndex = from; frameIndex <= to; frameIndex++) {
      if (ii++ === 0) {
        continue;
      }
      // start anim for one frame
      ag.start(false, 1, frameIndex, frameIndex, false);
      // wait for finishing
      await ag.onAnimationEndObservable.runCoroutineAsync(captureFrame());
      textureIndex++;
      // stop anim
      ag.stop();
    }
  }

  return vertexData;
}


class AnimationHelper {
  static RetargetSkeletonToAnimationGroup(animationGroup, retargetSkeleton) {
    for (let i = 0; i < animationGroup.targetedAnimations.length; ++i) {
      const ta = animationGroup.targetedAnimations[i];
      const bone = AnimationHelper._FindBoneByTransformNodeName(retargetSkeleton, ta.target.name);
      if (!bone) {
        animationGroup.targetedAnimations.splice(i, 1);
        i--;
        continue;
      }
      bone._linkedTransformNode = ta.target;
    }
  }

  static RetargetAnimationGroupToRoot(animationGroup, root) {
    for (let i = 0; i < animationGroup.targetedAnimations.length; ++i) {
      const ta = animationGroup.targetedAnimations[i];
      const children = root.getDescendants(false, (node) => node.name === ta.target.name);
      if (children.length === 0) {
        animationGroup.targetedAnimations.splice(i, 1);
        i--;
        continue;
      }
      ta.target = children[0];
    }
  }
  static _FindBoneByTransformNodeName(skeleton, name) {
    for (const bone of skeleton.bones) {
      if (bone._linkedTransformNode.name === name) {
        return bone;
      }
    }
    return null;
  }
}

// async function addSpawn(modelName, models) {

//   const container = await this.getAssetContainer(modelName);

//   console.log('model name', modelName, container.meshes, container.skeletons);
//   if (!container) { 
//     console.log('Did not load model', modelName);
//     return;
//   }
//   const instSpawn = new Spawn(models[0]);

//   // Create root for animations
//   const { rootNodes, animationGroups, skeletons } = container.instantiateModelsToScene(undefined, false, { doNotInstantiate: false });
//   const skeleton = skeletons[0];
//   const root = rootNodes[0];
//   root.position.setAll(0);
//   root.scaling.setAll(1);
//   root.rotationQuaternion = null;
//   root.rotation.setAll(0);
//   for (const mesh of root.getChildMeshes()) {
//     mesh.name = mesh.material.name;
//     // mesh.refreshBoundingInfo(true, true);
//   }
//   const skeletonForAnim = [];
//   const rootForAnim = [];
 
 
//   this.updateTextures(-1, { rootNode: root, spawn: instSpawn }, modelName, true);
//   animationGroups.forEach(ag => {
//     const name = ag.name.replace('Clone of ', '');
//     const skel = skeleton.clone(`skeleton_${ name}`);
//     skeletonForAnim.push(skel);

//     const rootAnim = root.instantiateHierarchy(undefined, { doNotInstantiate: true }, (source, clone) => {
//       clone.name = source.name;
//     });
//     rootAnim.name = `${modelName}_${ name}`;
//     rootAnim.setEnabled(false);
//     rootForAnim.push(rootAnim);
//   });

  
//   const merged = mergeSkeleton(root, skeleton);

//   root.setEnabled(false);

//   merged.registerInstancedBuffer('bakedVertexAnimationSettingsInstanced', 4);
//   merged.instancedBuffers.bakedVertexAnimationSettingsInstanced = new Vector4(0, 0, 0, 0);

//   const ranges = calculateRanges(animationGroups);

//   const frameOffset = 0;

//   const setAnimationParameters = (
//     vec,
//     animIndex = Math.floor(Math.random() * animationGroups.length)
//   ) => {
//     const anim = ranges[animIndex];
//     const from = Math.floor(anim.from);
//     const to = Math.floor(anim.to);
//     const ofst = frameOffset;
//     vec.set(from, to - 1, ofst, 60);

//     return animIndex;
//   };

//   const b = new VertexAnimationBaker(this.#scene, merged);
//   const manager = new BakedVertexAnimationManager(this.#scene);

//   merged.bakedVertexAnimationManager = manager;
//   merged.instancedBuffers.bakedVertexAnimationSettingsInstanced = new Vector4(0, 0, 0, 0);
//   setAnimationParameters(merged.instancedBuffers.bakedVertexAnimationSettingsInstanced, 0);
//   merged.setEnabled(false);
//   const cacheName = `${modelName}_vertex_data`;
//   const cachedData = await getDataEntry(cacheName);
//   let buffer;
//   if (cachedData) {
//     buffer = cachedData.data;
//   } else {
//     buffer = await bakeVertexData(merged, animationGroups);
//     await setDataEntry(cacheName, buffer);
//   }

//   manager.texture = b.textureFromBakedVertexData(buffer);

//   this.#scene.registerBeforeRender(() => {
//     manager.time += this.#scene.getEngine().getDeltaTime() / 1000.0;

//     skeletonForAnim.forEach((skel) => {
//       skel.prepare();
//     });

//     const frame = manager.time * 60 + frameOffset;

//     animationGroups.forEach((animationGroup) => {
//       animationGroup.goToFrame(frame);
//     });
//   });

//   for (const animationGroup of animationGroups) {
//     const indexAnim = animationGroups.map(a => a.name).indexOf(animationGroup.name);
//     if (indexAnim >= 0) {
//       AnimationHelper.RetargetAnimationGroupToRoot(animationGroup, rootForAnim[indexAnim]);
//       AnimationHelper.RetargetSkeletonToAnimationGroup(animationGroup, skeletonForAnim[indexAnim]);
//       // animationGroup.play(true);
//     }
//   }



//   for (const [_idx, spawnEntry] of Object.entries(models)) {
//     const { x, y, z, spawn_id: id, name } = spawnEntry;
//     // const instanceContainer = container.instantiateModelsToScene();
//     const instanceNode = merged.createInstance(`instance_${ id}`);
//     instanceNode.showBoundingBox = true;
//     instanceNode.instancedBuffers.bakedVertexAnimationSettingsInstanced = new Vector4(0, 0, 0, 0);
//     setAnimationParameters(instanceNode.instancedBuffers.bakedVertexAnimationSettingsInstanced, 0);


//     if (!instanceNode) {
//       console.log('No root node for container spawn', instanceNode, spawnEntry);
//       return;
//     }

//     instanceNode.id = `spawn_${id}`;
//     instanceNode.name = name;
//     // instanceContainer.animationGroups?.[0]?.play(true);

//     const scale = spawnEntry.size / 3;
//     instanceNode.scaling.z = scale;
//     instanceNode.scaling.x = scale;
//     instanceNode.scaling.y = scale;
//     const height = instanceNode.getHierarchyBoundingVectors().max.y - instanceNode.getHierarchyBoundingVectors().min.y;
//     instanceNode.position = eqtoBabylonVector(x, y, z + 5);
//     instanceNode.rotation = new Vector3(Tools.ToRadians(0), Tools.ToRadians(180) + Tools.ToRadians(spawnEntry.heading), Tools.ToRadians(0));
    
//     const ag = new PhysicsAggregate(instanceNode, PhysicsShapeType.BOX, { center: new Vector3(0, -4, 0), extents: new Vector3(2, height, 2), mass: 1, restitution: 0, friction: 1 });
//     ag.body.setMassProperties({
//       inertia: new Vector3(0, 0, 0)
//     });
    
//     instanceNode.setEnabled(false);

//     instanceNode.isPickable = true;
//     instanceNode.addLODLevel?.(500, null);
//     instanceNode.checkCollisions = true;
//     instanceNode.name = instanceNode.material.name;

//     instanceNode.metadata = {
//       spawn: true,
//     };
   

//     const nameplate = new TextBlock(`spawn_${id}_nameplate`, name);
//     nameplate.color = 'teal';
//     nameplate.fontFamily = 'arial';
//     nameplate.fontSize = 20;
//     guiController.manager.addControl(nameplate);
//     nameplate.linkOffsetYInPixels = -30;
//     nameplate.isVisible = false;

//     this.spawns[id] = {
//       spawn           : new Spawn(spawnEntry),
//       rootNode        : instanceNode,
//       physicsAggregate: ag,
//       animationGroups,
//       nameplate,
//     };

//     // this.updateTextures(id);
//     this.calculateNameplate(id, true);
    
//     const vec = new ThreeVector3(instanceNode.absolutePosition.x, instanceNode.absolutePosition.y, instanceNode.absolutePosition.z);
//     if (this.octree.get(vec)) {
//       this.octree.set(vec, [...this.octree.get(vec), id]);
//     } else {
//       this.octree.set(vec, [id]);
//     }
//   }
// }
export const spawnController = new SpawnController();