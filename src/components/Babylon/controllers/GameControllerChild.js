

export class GameControllerChild {
  /** @type {import('./GameController').GameController} */
  #gc = null;

  setGameController(gameController) {
    this.#gc = gameController;
  }

  get canvas() {
    return this.#gc.canvas;
  }

  get engine() {
    return this.#gc.engine;
  }

  get CameraController () {
    return this.#gc.CameraController;
  }
  get LightController () {
    return this.#gc.LightController;
  }
  get SkyController () {
    return this.#gc.SkyController;
  }
  get MusicController () {
    return this.#gc.MusicController;
  }
  get SoundController () {
    return this.#gc.SoundController;
  }
  get SpawnController () {
    return this.#gc.SpawnController;
  }
  get GuiController () {
    return this.#gc.GuiController;
  }
  get ItemController () {
    return this.#gc.ItemController;
  }
}