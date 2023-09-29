import { SceneLoader, Tools, Vector3 } from '@babylonjs/core';
import raceData from '../../../common/raceData.json';
const modelsUrl = 'https://eqrequiem.blob.core.windows.net/assets/models/';


class SpawnController {
  /**
   * @type {import('@babylonjs/core/scene').Scene} scene
   */
  #scene = null;
  dispose() {

  }

  setupSpawnController (scene) {
    this.#scene = scene;
  }

  async addSpawns (spawns) {
    const aggregateSpawns = spawns;
    window.w = aggregateSpawns;
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
      const container = await SceneLoader.LoadAssetContainerAsync(modelsUrl, `${modelName}.glb.gz`, this.#scene, undefined, '.glb').catch(a => null);
      if (!container) {
        console.log('Did not load model', modelName);
        continue;
      }
      for (const [idx, sp] of Object.entries(models)) {
        const { x, y, z } = sp;
        const c = container.instantiateModelsToScene(() => `${modelName}_${idx}`);
        const hasAnimations = c.animationGroups.length > 0;
    
        const rootNode = c.rootNodes[0];
        if (!rootNode) {
          console.log('No root node for container spawn', c, sp);
          continue;
        }
        for (const mesh of rootNode.getChildMeshes()) {
          c.animationGroups?.[0]?.play();
          mesh.position = new Vector3(-1 * x, z, y);
          // mesh.rotation = new Vector3(Tools.ToRadians(rotX), Tools.ToRadians(180) + Tools.ToRadians(-1 * rotY), Tools.ToRadians(rotZ));
          mesh.checkCollisions = true;
          // mesh.scaling.z = 10;
          mesh.metadata = {
            spawn: true,
          };
          mesh.id = `${modelName}_${idx}`;
          if (!hasAnimations) {
            mesh.freezeWorldMatrix();
          }
        }
      }
    }
    
  }
}

export const spawnController = new SpawnController();