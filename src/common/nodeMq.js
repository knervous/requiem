const mq = global.mq;

const stop = () => mq.commands.run('nodestop');

function distance (pt1, pt2) {
  const diffX = pt1.x - pt2.x;
  const diffY = pt1.y - pt2.y;
  return Math.sqrt(diffX * diffX + diffY * diffY);
}

function makePoint (spawn) {
  return {
    x: spawn.x,
    y: spawn.y
  };
}

// exported
function sleep (ms = 1000) {
  return new Promise(res => setTimeout(res, ms));
}

function distanceBetweenSpawns (spawn1, spawn2) {
  if (!spawn1 || !spawn2) {
    return Infinity;
  }
  return distance(makePoint(spawn1), makePoint(spawn2));
}

async function main (fn, loopSpeed = 50) {
  while (true) {
    try {
      await fn();
    } catch (e) {
      mq.log(`Got an error during main loop: ${e.message}`);
    }

    await sleep(loopSpeed);
  }
}

function getClosestOfSpawnNames (names) {
  if (!Array.isArray(names)) {
    mq.warn('Bad params, arg 1 should be an array of strings');
  }
  const myLoc = makePoint(mq.me.spawn);
  return names
    .map(name => mq.getNthNearestSpawn(name, 1))
    .filter(Boolean)
    .reduce((next, current) => {
      current.distanceFromMe = distance(myLoc, makePoint(current));
      if (next === null) {
        return current;
      }
      next.distanceFromMe = distance(myLoc, makePoint(next));
      return current.distanceFromMe < next.distanceFromMe ? current : next;
    }, null);
}

function useDebugger (port = 9229) {
  const inspector = require('inspector');
  inspector.open(port, '0.0.0.0');
}

let spawnListeners = [];
let despawnListeners = [];
let chatListeners = [];

if (window.addMqListener) {
  window.addMqListener('spawn', (name, data) => {
    switch (name) {
      case 'spawn':
        spawnListeners.forEach(fn => fn(data));
        break;
      default:
        break;
    }
  });
  window.addMqListener('despawn', (name, data) => {
    switch (name) {
      case 'despawn':
        despawnListeners.forEach(fn => fn(data));
        break;
      default:
        break;
    }
  });
  window.addMqListener('chat', (name_, line) => {
    chatListeners.forEach(fn => fn(line));
  });
}

function addSpawnListener (listener) {
  spawnListeners.push(listener);
}

function removeSpawnListener (listener) {
  spawnListeners = spawnListeners.filter(fn => fn !== listener);
}

function addDespawnListener (listener) {
  despawnListeners.push(listener);
}

function removeDespawnListener (listener) {
  despawnListeners = despawnListeners.filter(fn => fn !== listener);
}

function addChatListener (listener) {
  chatListeners.push(listener);
}

function removeChatListener (listener) {
  chatListeners = despawnListeners.filter(fn => fn !== listener);
}

class ExtensibleFunction extends Function {
  constructor (t) {
    return Object.setPrototypeOf(t, new.target.prototype);
  }
}
class MqProxy extends ExtensibleFunction {
  constructor (t = []) {
    return (
      super(t =>
        void 0 !== t
          ? ((this.path[this.path.length - 1] += `[${t}]`),
          new MqProxy(this.path))
          : mq.eval(this.path.join('.'))
      ),
      (this.path = t),
      new Proxy(this, {
        get: (t, e) => new MqProxy(this.path.concat(e.toString()))
      })
    );
  }
}

module.exports = {
  ...mq,
  log : mq.log,
  warn: mq.warn,
  eval: mq.eval,
  run : mq.run,
  util: {
    stop,
    useDebugger,
    main,
    sleep,
    getClosestOfSpawnNames,
    distanceBetweenSpawns,
    getSpawnById      : mq.getSpawnById,
    getZoneSpawns     : mq.getZoneSpawns,
    getNthNearestSpawn: mq.getNthNearestSpawn
  },
  tlo      : new MqProxy(),
  listeners: {
    addSpawnListener,
    removeSpawnListener,
    addDespawnListener,
    removeDespawnListener,
    addChatListener,
    removeChatListener
  }
};
