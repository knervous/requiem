import * as EQPacket from '../../../net/packet/EQPacket';
import { EqSocket } from '../../../net/socket/eqsocket';
import { GAME_STATES, GlobalStore } from '../../../state';
import { GameControllerChild } from './GameControllerChild';
import { EQClientPacket } from '../../../net/packet/EQClientPacket.js';
import { EQOpCodes, getOpCodeDesc } from '../../../net/message/index.js';
import { EQServerPacket } from '../../../net/packet/EQServerPacket.js';
class NetWorldController extends GameControllerChild {
  #socket = new EqSocket();

  constructor() {
    super();
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  async onMessage(opcode, data) {
    console.log(
      `Got world message: ${getOpCodeDesc(opcode)}`,
      data,
    );
    switch (opcode) {
      case EQOpCodes.OP_SendCharInfo: {
        const charInfo = EQServerPacket.CharacterSelect(data, opcode);
        console.log('Char info', charInfo);
        GlobalStore.actions.setLoginState({ characters: charInfo.characters, loading: false });
        break;
      }
      case EQOpCodes.OP_ZoneServerInfo:
        // const zoneInfo = new EQPacket.ZoneInfo(data).toObject();
        // GlobalStore.actions.setZonePort(zoneInfo.port);
        // await this.NetZoneController.zoneConnect(zoneInfo.port, this.state.character);
        break;
      default:
        console.warn(
          `Got unhandled world message: ${getOpCodeDesc(opcode)}`,
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

  /**
   * 
   * @param {string} name 
   * @param {import('../../../state/defaultState.d.ts')} zoneInfo 
   */
  async characterLogin(name, zoneInfo) {
    GlobalStore.actions.setZoneInfo(zoneInfo);
    GlobalStore.actions.setGameState(GAME_STATES.IN_ZONE);
    GlobalStore.actions.setCharacter(name);
    this.#socket.send(new EQPacket.EnterWorld(name, false, false));
  }

  async worldConnect(lsid, key) {
    await this.#socket.connect('9500', this.onMessage, this.onClose);
    GlobalStore.actions.setLoginState({ loading: true });
    this.#socket.send(EQClientPacket.SendLoginInfo({ name: lsid, password: key, zoning: false }));
  }

}

export const netWorldController = new NetWorldController();