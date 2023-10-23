import * as EQPacket from '../../../net/packet/EQPacket';
import { OP_CODES, getOpCode, getOpCodeDesc } from '../../../net/packet/opcodes';
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

  async onMessage(data) {
    const opc = getOpCode(data);
    switch (opc) {
      case OP_CODES.OP_LoginAccepted: {
        const playerLoginInfo = new EQPacket.PlayerLoginReply(data);
        GlobalStore.actions.setLoginState({ ...playerLoginInfo.toObject(), loading: false, triedLogin: true });
        if (playerLoginInfo.success) {
          this.#socket.send(new EQPacket.ServerListRequest(4));
        }
        break;
      }
      case OP_CODES.OP_ServerListResponse: {
        const lr = new EQPacket.ListServerResponse(data);
        GlobalStore.actions.setLoginState({ serverList: lr.toObject().server_list, loggedIn: true });
        break;
      }
      case OP_CODES.OP_PlayEverquestResponse: {
        const eqResponse = new EQPacket.PlayEverquestResponse(data);
        GlobalStore.actions.setSelectedServer(eqResponse.server_id);
        GlobalStore.actions.setGameState(GAME_STATES.CHAR_SELECT);
        break;
      }
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
    this.#socket.send(new EQPacket.Login(`${username}:${password}`));
  }

  async serverLogin(serverId) {
    this.#socket.send(new EQPacket.PlayEverquest([5, false, 0, 0], serverId));
    const { lsid, key } = GlobalStore.getState().loginState;
    this.NetWorldController.worldConnect(lsid.toString(), key);
  }
}

export const netLoginController = new NetLoginController();