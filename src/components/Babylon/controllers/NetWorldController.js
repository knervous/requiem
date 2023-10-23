import * as EQPacket from '../../../net/packet/EQPacket';
import { OP_CODES, getOpCode, getOpCodeDesc } from '../../../net/packet/opcodes';
import { EqSocket } from '../../../net/socket/eqsocket';
import { GAME_STATES, GlobalStore } from '../../../state';
import { GameControllerChild } from './GameControllerChild';
import { sleep } from '../../../util/util';
class NetWorldController extends GameControllerChild {
  #socket = new EqSocket();

  constructor() {
    super();
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  async onMessage(data) {
    const opc = getOpCode(data);
    console.log(
      `Got world message: ${getOpCodeDesc(data)}`,
      data,
    );
    switch (opc) {
      case OP_CODES.OP_SendCharInfo: {
        const charInfo = new EQPacket.CharacterSelectEntry(data);
        GlobalStore.actions.setLoginState({ characters: charInfo.characters, loading: false });
        break;
      }
      case OP_CODES.OP_ZoneServerInfo:
        const zoneInfo = new EQPacket.ZoneInfo(data).toObject();
        GlobalStore.actions.setZonePort(zoneInfo.port);
        await this.NetZoneController.zoneConnect(zoneInfo.port, this.state.character);
        break;
      default:
        console.warn(
          `Got unhandled world message: ${getOpCodeDesc(data)}`,
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
    await this.#socket.connect('7777', this.onMessage, this.onClose);
    GlobalStore.actions.setLoginState({ loading: true });
    await sleep(500);
    this.#socket.send(
      new EQPacket.LoginInfo(
        [lsid, key],
        false,
      ),
    );
  }

}

export const netWorldController = new NetWorldController();