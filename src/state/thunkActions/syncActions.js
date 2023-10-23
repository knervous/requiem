// import { actions } from '../reducers';
// import { GlobalStore } from '../store';

import { gameController } from '../../components/Babylon/controllers/GameController';
import { GAME_STATES } from '../constants';
import { GlobalStore } from '../store';


export function resetLogin() {
  gameController.NetZoneController.disconnect();
  gameController.NetWorldController.disconnect();
  gameController.NetLoginController.disconnect();
  GlobalStore.actions.setGameState(GAME_STATES.LOGIN);
  GlobalStore.actions.resetLoginState();
}