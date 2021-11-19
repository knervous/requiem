
import { mockMq } from './mockMq';

export const mq = global.mq || mockMq;

// This is how we proxy MQData objects.
// Use would be `mq.tlo.Me.Buff('Clarity').Duration.Seconds()`
class ExtensibleFunction extends Function {
  constructor(t) {
    return Object.setPrototypeOf(t, new.target.prototype);
  }
}
class MqProxy extends ExtensibleFunction {
  constructor(t = []) {
    return (
      super((t) =>
        void 0 !== t
          ? ((this.path[this.path.length - 1] += `[${t}]`),
          new MqProxy(this.path))
          : mq.eval(this.path.join('.'))
      ),
      (this.path = t),
      new Proxy(this, {
        get: (t, e) => new MqProxy(this.path.concat(e.toString())),
      })
    );
  }
}
mq.tlo = new MqProxy();

let spawnListeners = [];
let despawnListeners = [];
let chatListeners = [];

if (window.addMqListener) {
  window.addMqListener('spawn', (name, data) => {
    switch (name) {
      case 'spawn':
        spawnListeners.forEach((fn) => fn(data));
        break;
      default:
        break;
    }
  });
  window.addMqListener('despawn', (name, data) => {
    switch (name) {
      case 'despawn':
        despawnListeners.forEach((fn) => fn(data));
        break;
      default:
        break;
    }
  });
  window.addMqListener('chat', (name_, line) => {
    chatListeners.forEach(fn => fn(line));
  });
}

export function addSpawnListener(listener) {
  spawnListeners.push(listener);
}

export function removeSpawnListener(listener) {
  spawnListeners = spawnListeners.filter((fn) => fn !== listener);
}

export function addDespawnListener(listener) {
  despawnListeners.push(listener);
}

export function removeDespawnListener(listener) {
  despawnListeners = despawnListeners.filter((fn) => fn !== listener);
}

export function addChatListener(listener) {
  chatListeners.push(listener);
}

export function removeChatListener(listener) {
  chatListeners = despawnListeners.filter((fn) => fn !== listener);
}