import { GAME_STATES } from './constants';


export const defaultState = {
  worldState: {
    server: -1
  },
  zoneInfo: {
    zone     : 2,
    shortName: 'qeynos2',
    longName : 'North Qeynos',
  },
  zonePort: -1,
  zone    : {
    spawns: []
  },
  loginState: null,
  character : '',
  gameState : GAME_STATES.LOGIN,
  chat      : {
    chatLines: []
  },
  ui: {
    settingsOpen : false,
    visibleSpawns: {}
  }
};

export default defaultState;