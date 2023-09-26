
import { Vector3 } from '@babylonjs/core';
import raceData from '../../../common/raceData.json';
import { getCachedTexture } from '../hooks/useCachedTexture';
import { AnimationGroup, Animation } from '@babylonjs/core';
const storageUrl = 'https://mqbrowser.blob.core.windows.net/zones/models/';

class SpawnPool {
  #spawns = new Map();
  #scene = null;
  #setInitialized = null;
  #initialized = new Promise(res => {
    this.#setInitialized = res;
  });

  #HUM_animations = [];
  #HUF_animations = [];
  constructor() {
    this.#spawns.clear();
    this.initialize();
    // this.addZoneSpawns([{ race: 1, gender: 0, skip: true, spawn_id: -1 }]);
  }

  async initialize() {
    while (!this.#scene) {
      await new Promise(res => setTimeout(res, 100));
    }
    import('./data/animations/hum.json').then(({ default: HUM_animations }) => {
      console.log('anim', HUM_animations);
      // this.#HUM_animations = HUM_animations.map(animation => AnimationGroup.Parse(animation, this.#scene));
      this.#HUM_animations = HUM_animations;
      this.#setInitialized();
    });
  }

  setScene(scene) {
    this.#scene = scene;
  }

  get spawns() {
    return this.#spawns;
  }

  async addZoneSpawns(spawns) {
    await this.#initialized;
    console.log('spawns', spawns, 'scene', this.#scene, 'this', this);
    for (const spawn of spawns) {
      const model = raceData.find(r => r.id === spawn.race);
      const realModel = (model[spawn.gender] || model['2'] || 'HUM').toLowerCase();
      getCachedTexture(storageUrl, realModel, this.#scene).then(zoneSpawn => {
        if (spawn.skip) {
          this.#spawns.set(spawn.spawn_id, zoneSpawn);
          return;
        }
        const [rootMesh] = zoneSpawn.meshes ?? [];
        if (rootMesh) {
          rootMesh.name = spawn.name;
          // rootMesh.position = new Vector3(spawn.y, spawn.z, spawn.x);
          rootMesh.scaling.x = 15;
          rootMesh.scaling.y = 15;
          rootMesh.scaling.z = 15;
        }
        if (spawn.race >= 1 && spawn.race <= 13) {
           
        } else {
          for (const material of zoneSpawn.meshes?.flatMap(mesh => mesh?.material)?.filter(Boolean)) {
            const newTexture = String(spawn.equipment[0].material).padStart(2, '0');
            const newName = material.name
              .slice(2)
              .replace('00', newTexture)
              .replace(/_/g, '');
      
            for (const texture of material.getActiveTextures()) {
              texture.updateURL(`${storageUrl}Textures/${newName}.png`);
            }
                
          }
        }

        zoneSpawn.name = spawn.name;


        // this.#scene.
        this.#spawns.set(spawn.spawn_id, zoneSpawn);
      });

   
    }
  }

}

export const spawnPool = window.spawnPool = new SpawnPool();