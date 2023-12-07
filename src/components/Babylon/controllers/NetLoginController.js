import { EQClientPacket } from '../../../net/packet/EQClientPacket';
import { EQServerPacket } from '../../../net/packet/EQServerPacket';
import * as EQPacket from '../../../net/packet/EQPacket';
import { EQOpCodes, getOpCode, getOpCodeDesc } from '../../../net/message';
import { EqSocket } from '../../../net/socket/eqsocket';
import { GAME_STATES, GlobalStore } from '../../../state';
import { GameControllerChild } from './GameControllerChild';


class NetLoginController extends GameControllerChild {
  #socket = new EqSocket();
  /** @type {Promise} */
  connectionPromise = null;

  constructor() {
    super();
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  async onMessage(opcode, data) {
    switch (opcode) {
      case EQOpCodes.OP_LoginAccepted: {
        const playerLoginInfo = EQServerPacket.LoginReply(data);
        GlobalStore.actions.setLoginState({ ...playerLoginInfo, loading: false, triedLogin: true });
        console.log('login info', playerLoginInfo);
        // if (playerLoginInfo.success) {
        //   this.#socket.send(new EQPacket.ServerListRequest(4));
        // }
        break;
      }
      // case EQOpCodes.OP_ServerListResponse: {
      //   const lr = new EQPacket.ListServerResponse(data);
      //   GlobalStore.actions.setLoginState({ serverList: lr.toObject().server_list, loggedIn: true });
      //   break;
      // }
      // case EQOpCodes.OP_PlayEverquestResponse: {
      //   const eqResponse = new EQPacket.PlayEverquestResponse(data);
      //   GlobalStore.actions.setSelectedServer(eqResponse.server_id);
      //   GlobalStore.actions.setGameState(GAME_STATES.CHAR_SELECT);
      //   break;
      // }
      default:
        console.warn(
            `Got unhandled login message: ${getOpCodeDesc(data)}`,
            data,
        );
        break;
    }
  }

  disconnect() {
    this.#socket.close();
  }

  async onClose() {
  }

  async login(username, password) {
    if (!this.#socket.isConnected) {
      await this.#socket.connect('7775', this.onMessage, this.onClose);
    }
    this.#socket.send(EQClientPacket.LoginPacket({ username, password }));
  }

  async serverLogin(serverId) {
    this.#socket.send(new EQPacket.PlayEverquest([5, false, 0, 0], serverId));
    const { lsid, key } = GlobalStore.getState().loginState;
    this.NetWorldController.worldConnect(lsid.toString(), key);
  }
}

export const netLoginController = new NetLoginController();