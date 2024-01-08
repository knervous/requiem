import { EqSocket } from '../../../net/socket/eqsocket';
import { GAME_STATES, GlobalStore } from '../../../state';
import { GameControllerChild } from './GameControllerChild';
import { EQClientPacket } from '../../../net/packet/EQClientPacket.js';
import { EQOpCodes, getOpCodeDesc } from '../../../net/message/index.js';
import { EQServerPacket, decode } from '../../../net/packet/EQServerPacket.js';
import { gameController } from './GameController.js';
class NetWorldController extends GameControllerChild {
  #socket = new EqSocket();

  constructor() {
    super();
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  async onMessage(opcode, data) {
    switch (opcode) {
      case EQOpCodes.OP_SendCharInfo: {
        const charInfo = EQServerPacket.CharacterSelect(data, opcode);
        console.log('Char info', charInfo);
        GlobalStore.actions.setLoginState({ characters: charInfo.characters, loading: false });
        break;
      }
      case EQOpCodes.OP_ZoneServerInfo:
        const zoneInfo = EQServerPacket.ZoneServerInfo(data, opcode);
        console.log('Zone info', zoneInfo);
        const port = zoneInfo.port + 1000;
        GlobalStore.actions.setZonePort(port);
        await this.NetZoneController.zoneConnect(port, this.state.character);
        break;

      case EQOpCodes.OP_ApproveName_Server:
        const info = EQServerPacket.Int(data, opcode);
        if (info.value === 0) {
          gameController.addToast('Name was rejected.');
        }
        break;


      case EQOpCodes.OP_SendMaxCharacters:
        const maxChar = EQServerPacket.Int(data).value;
        console.log('Max char', maxChar);
        
        break;
      case EQOpCodes.OP_GuildsList:
        const guilds = EQServerPacket.GuildsList(data);
        console.log('Guilds', guilds);

        break;
      case EQOpCodes.OP_MOTD:
        gameController.addToast(EQServerPacket.GuildMOTD(data).name);

        break;
      case EQOpCodes.OP_ZoneUnavail:
        gameController.addToast(`Zone Unavailable: ${EQServerPacket.ZoneUnavail(data).zonename}`);
        break;
      // Consume these, they don't mean anything for our client
      case EQOpCodes.OP_LogServer:
      case EQOpCodes.OP_ApproveWorld:
      case EQOpCodes.OP_PostEnterWorld:
      case EQOpCodes.OP_ExpansionInfo:
      case EQOpCodes.OP_EnterWorld:
      case EQOpCodes.OP_SendMembership:
      case EQOpCodes.OP_SendMembershipDetails:
        break;
      default:
        console.warn(
          `Got unhandled world message: ${getOpCodeDesc(opcode)}`,
          decode(data, opcode),
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
    await this.NetZoneController.zoneConnect(8000, this.state.character);
    this.#socket.send(EQClientPacket.EnterWorld({ name, tutorial: 0, returnHome: 0 }));
  }

  /**
   * 
   * @param {string} name 
   */
  async characterDelete(name) {
    this.#socket.send(EQClientPacket.SendOpCode(EQOpCodes.OP_DeleteCharacter, { value: name }));
  }

  async worldConnect(lsid, key) {
    await this.#socket.connect('9500', this.onMessage, this.onClose);
    GlobalStore.actions.setLoginState({ loading: true });
    this.#socket.send(EQClientPacket.LoginInfo({ name: lsid, password: key, zoning: false }));
  }

  async checkName(name, gender, race) {
    this.#socket.send(EQClientPacket.NameApprove({ name, race, gender }));
  }

  async createCharacter(name, character) {
    this.#socket.send(EQClientPacket.NameApprove({ name, race: character.race, gender: character.gender }));
    this.#socket.send(EQClientPacket.CharCreate(character));
    // this.#socket.send(EQClientPacket.ch)
  }

}

export const netWorldController = new NetWorldController();