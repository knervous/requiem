import { Color3, Engine, Material, MultiMaterial, SceneLoader, SubMesh } from '@babylonjs/core';
import { GradientMaterial } from '@babylonjs/materials';

const skyUrl = 'https://eqrequiem.blob.core.windows.net/assets/sky/';

class SkyController {
  #moveInterval = -1;
  dispose() {
    clearInterval(this.#moveInterval);
  }

  /**
   * @param {import('@babylonjs/core/scene').Scene} scene
   * @param {number} index 
   * @param {boolean} fromSerialized
   */
  async loadSky(scene, index, fromSerialized) {
    let skyRoot;
    if (!fromSerialized) {
 
      const sky = await SceneLoader.ImportMeshAsync(
        '',
        skyUrl,
        `sky${index}.glb`,
        scene,
        undefined,
        '.glb'
      );
      skyRoot = sky.meshes[0];
      skyRoot.scaling.x = 15000;
      skyRoot.scaling.y = 15000;
      skyRoot.scaling.z = 15000;
      skyRoot.name = '__sky__';
      const [cloudLayer] = skyRoot.getChildMeshes();
      const multimat = new MultiMaterial('multi', scene);
      const origMaterial = cloudLayer.material;
  
      const gradientMaterial = new GradientMaterial('grad', scene);
      gradientMaterial.topColor = new Color3(119 / 255, 46 / 255, 146 / 255);
      gradientMaterial.bottomColor = new Color3(190 / 255, 26 / 255, 22 / 255);// 
      gradientMaterial.offset = 0;
      gradientMaterial.smoothness = 1;
      gradientMaterial.scale = 5;
      gradientMaterial.alpha = 1;
      gradientMaterial.topColorAlpha = 0.1;
      gradientMaterial.bottomColorAlpha = 0.6;
      gradientMaterial.transparencyMode = Material.MATERIAL_ALPHABLEND;
      gradientMaterial.alphaMode = Engine.ALPHA_COMBINE;
  
      cloudLayer.material = multimat;
  
      multimat.subMaterials.push(origMaterial);
      multimat.subMaterials.push(gradientMaterial);
  
      const verticesCount = cloudLayer.getTotalVertices();
      const indc = cloudLayer.getTotalIndices();
      new SubMesh(0, 0, verticesCount, 0, indc, cloudLayer);
      new SubMesh(1, 0, verticesCount, 0, indc, cloudLayer);
    } else {
      skyRoot = scene.getMeshByName('__sky__');
    }

    const [cloudLayer, upperLayer] = skyRoot.getChildMeshes();
    const [cloudTexture] = cloudLayer.material.getActiveTextures();
    const [upperLayerTexture] = upperLayer.material.getActiveTextures();

    this.#moveInterval = setInterval(() => {
      cloudTexture.uOffset += 0.0001;
      cloudTexture.vOffset += 0.0001;
      upperLayerTexture.vOffset -= 0.0001;
      upperLayerTexture.vOffset -= 0.0001;
    }, 10);
  }
}

export const skyController = new SkyController();