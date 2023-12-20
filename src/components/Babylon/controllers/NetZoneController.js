import { EQOpCodes, getOpCodeDesc } from '../../../net/message';
import { EQClientPacket } from '../../../net/packet/EQClientPacket';
import { decode } from '../../../net/packet/EQServerPacket';

import { EqSocket } from '../../../net/socket/eqsocket';
import { GameControllerChild } from './GameControllerChild';

class NetZoneController extends GameControllerChild {
  #socket = new EqSocket();

  get socket() {
    return this.#socket;
  }
  constructor() {
    super();
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  async onMessage(opcode, data) {
    switch (opcode) {
      // case EQOpCodes.OP_ZoneSpawns: {
      //   const { spawns } = new ZonePacket.ZoneSpawns(data).toObject();
      //   this.setLoading(true);
      //   await this.SpawnController.addSpawns(spawns);
      //   this.setLoading(false);
      //   break;
      // }
    //  case EQOpCodes.OP_ClientUpdate:{
      // const update = new ZonePacket.SpawnPositionUpdate(data).toObject();
      // this.SpawnController.netUpdateSpawn(update);
      // console.log('Update spawn', update);
      // GlobalStore.actions.updateZoneSpawn(update);
      // this.setLoading(false);
      //  break;
    //  }
      // case EQOpCodes.OP_DeleteSpawn: {
      //   const id = new ZonePacket.SpawnDelete(data).toObject().spawn_id;
      //   GlobalStore.actions.removeZoneSpawns([id]);
      //   break;
      // }
      // case EQOpCodes.OP_NewSpawn:  
      //   const newSpawn = new ZonePacket.Spawn(data).toObject();
      //   await this.SpawnController.addSpawns([newSpawn]);
      //   break;
      // case OP_CODES.OP_SpecialMesg:
      //   const specialMsg = new ZonePacket.SpecialMessage(data).toObject();
      //   GlobalStore.actions.addChatLine(specialMsg);
      //   break;
      // case EQOpCodes.OP_FormattedMessage:
      //   const formattedMessage = new ZonePacket.FormattedMessage(data).toObject();
      //   GlobalStore.actions.addChatLine(formattedMessage);
      //   break;
      // case EQOpCodes.OP_ChannelMessage:
      //   const message = new ZonePacket.ChannelMessage(data).toObject();
      //   GlobalStore.actions.addChatLine(message);
      //   break;
      // case EQOpCodes.OP_Animation:
      //   const animation = new ZonePacket.Animation(data).toObject();
      //   console.log('ANimation', animation);
      //   this.SpawnController.spawns[animation.id]?.playAnimation(animation.action, animation.speed);
      //   break;
      default:
        console.warn(
          `Got unhandled world message: ${getOpCodeDesc(opcode)}`,
          decode(data, opcode),
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

  async zoneConnect(port, character) {
    await this.#socket.connect(port, this.onMessage, this.onClose);
    this.#socket.send(EQClientPacket.ClientZoneEntry({ charName: character }));
    this.#socket.send(EQClientPacket.SendOpCode(EQOpCodes.OP_ClientReady, {}));
  }

}

export const netZoneController = new NetZoneController();