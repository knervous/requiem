import { AdvancedDynamicTexture } from '@babylonjs/gui';

class GUIController {
  /**
     * @type {GUI3DManager}
     */
  manager = null;
  dispose() {

  }

  setupGuiController (_scene) {
    this.manager = AdvancedDynamicTexture.CreateFullscreenUI('UI');
  }
}

export const guiController = new GUIController();