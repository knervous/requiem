import { UniversalCamera, Vector3 } from '@babylonjs/core';


class CameraController { 
  /**
   * @type {import('@babylonjs/core/Cameras').UniversalCamera}
*/
  camera = null;
  isLocked = false;
  dispose() {
    if (this.camera) {
      this.camera.dispose();
    }
    document.removeEventListener(
      'pointerlockchange',
      this.onChangePointerLock,
      false,
    );
    document.removeEventListener(
      'mspointerlockchange',
      this.onChangePointerLock,
      false,
    );
    document.removeEventListener(
      'mozpointerlockchange',
      this.onChangePointerLock,
      false,
    );
    document.removeEventListener(
      'webkitpointerlockchange',
      this.onChangePointerLock,
      false,
    );
    document.removeEventListener('keydown', this.keyHandler);
  }

  onChangePointerLock = () => {
    const controlEnabled =
        document.mozPointerLockElement ||
        document.webkitPointerLockElement ||
        document.msPointerLockElement ||
        document.pointerLockElement ||
        null;
    if (!controlEnabled) {
      this.isLocked = false;
    } else {
      this.isLocked = true;
    }
  };

  keyHandler = e => {
    if (e.key === ' ') {
      this.camera.position.y += 5;
    } 
  };

  /**
   * 
   * @param {import('@babylonjs/core/scene').Scene} scene 
   * @param {HTMLCanvasElement} canvas 
   * @returns 
   */
  createCamera = (scene, canvas) => {
    this.camera = new UniversalCamera('__camera__', new Vector3(5, 10, 0), scene);
    this.camera.setTarget(new Vector3(1, 10, 1));
    this.camera.touchAngularSensibility = 5000;

    this.camera.applyGravity = true;
    this.camera.ellipsoid = new Vector3(4, 4.5, 2);
    this.camera.checkCollisions = true;
    this.camera.attachControl(canvas, true);
    this.camera.keysUp.push(87);
    this.camera.keysDown.push(83);
    this.camera.keysRight.push(68);
    this.camera.keysLeft.push(65);
    this.camera.keysUpward.push(32);

    document.addEventListener('keydown', this.keyHandler.bind(this));
  
    if (scene && canvas) {
      scene.onPointerDown = (e) => {
        if (
          (e.button === 2 && !this.isLocked && canvas.requestPointerLock) ||
          canvas.msRequestPointerLock ||
          canvas.mozRequestPointerLock ||
          canvas.webkitRequestPointerLock
        ) {
          try {
            canvas.requestPointerLock();
          } catch {}
        }
      };
      scene.onPointerUp = e => {
        if (e.button === 2) {
          document.exitPointerLock();
        }
      };
    }
    
    document.addEventListener('pointerlockchange', this.onChangePointerLock.bind(this), false);
    document.addEventListener('mspointerlockchange', this.onChangePointerLock.bind(this), false);
    document.addEventListener(
      'mozpointerlockchange',
      this.onChangePointerLock.bind(this),
      false,
    );
    document.addEventListener(
      'webkitpointerlockchange',
      this.onChangePointerLock.bind(this),
      false,
    );
  };
}

export const cameraController = new CameraController();
