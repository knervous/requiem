import { EQClientPacket } from '../../../net/packet/EQClientPacket';
import { EQServerPacket } from '../../../net/packet/EQServerPacket';
import { EQOpCodes, getOpCodeDesc } from '../../../net/message';
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
    console.log('Got op code', opcode);
    switch (opcode) {
      case EQOpCodes.OP_LoginAccepted: {
        const playerLoginInfo = EQServerPacket.LoginReply(data, opcode);
        GlobalStore.actions.setLoginState({ ...playerLoginInfo, loading: false, triedLogin: true });
        console.log('login info', playerLoginInfo);
        if (playerLoginInfo.success) {
          this.#socket.send(EQClientPacket.LoginRequest({ sequence: 4 }));
        }
        break;
      }
      case EQOpCodes.OP_ServerListResponse: {
        const lsr = EQServerPacket.LoginServerResponse(data, opcode);
        console.log('got lsr', lsr);
        GlobalStore.actions.setLoginState({ serverList: lsr.servers, loggedIn: true });
        break;
      }
      case EQOpCodes.OP_PlayEverquestResponse: {
        const eqResponse = EQServerPacket.PlayEverquestResponse(data, opcode);
        console.log('eq response', eqResponse);

        if (eqResponse.success) {
          GlobalStore.actions.setSelectedServer(eqResponse.serverId);
          GlobalStore.actions.setGameState(GAME_STATES.CHAR_SELECT);
          const { lsid, key } = GlobalStore.getState().loginState;
          this.NetWorldController.worldConnect(lsid.toString(), key);
        }
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
    if (await this.#socket.connect('7775', this.onMessage, this.onClose)) {
      this.#socket.send(EQClientPacket.LoginMessage({ username, password }));
    } else {
      console.warn('Could not connect to loginserver');
    } 
  }

  async serverLogin(serverId) {
    this.#socket.send(EQClientPacket.PlayEverquest({ serverId }));
  }
}

export const netLoginController = new NetLoginController();