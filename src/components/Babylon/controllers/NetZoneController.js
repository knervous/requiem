import * as ZonePacket from '../../../net/packet/ZonePackets';

import { OP_CODES, getOpCode, getOpCodeDesc } from '../../../net/packet/opcodes';
import { EqSocket } from '../../../net/socket/eqsocket';
import { GlobalStore } from '../../../state';
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

  async onMessage(data) {
    const opc = getOpCode(data);
    switch (opc) {
      case OP_CODES.OP_ZoneSpawns: {
        const { spawns } = new ZonePacket.ZoneSpawns(data).toObject();
        this.setLoading(true);
        await this.SpawnController.addSpawns(spawns);
        this.setLoading(false);
        break;
      }
      case OP_CODES.OP_ClientUpdate:{
        const update = new ZonePacket.SpawnPositionUpdate(data).toObject();
        this.SpawnController.netUpdateSpawn(update);
        // console.log('Update spawn', update);
        // GlobalStore.actions.updateZoneSpawn(update);
        // this.setLoading(false);
        break;
      }
      case OP_CODES.OP_DeleteSpawn: {
        const id = new ZonePacket.SpawnDelete(data).toObject().spawn_id;
        GlobalStore.actions.removeZoneSpawns([id]);
        break;
      }
      case OP_CODES.OP_NewSpawn:  
        const newSpawn = new ZonePacket.Spawn(data).toObject();
        await this.SpawnController.addSpawns([newSpawn]);
        break;
      case OP_CODES.OP_ChannelMessage:
        const message = new ZonePacket.ChannelMessage(data).toObject();
        GlobalStore.actions.addChatLine(message);
        break;
      case OP_CODES.OP_Animation:
        const animation = new ZonePacket.Animation(data).toObject();
        console.log('ANimation', animation);
        this.SpawnController.spawns[animation.id]?.playAnimation(animation.action, animation.speed);
        break;
      default:
        console.warn(`Got unhandled zone message: ${getOpCodeDesc(data)}`, data);
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

    this.#socket.send(new ZonePacket.ZoneEntry(0, character));
    this.#socket.send(new ZonePacket.ZoneClientReady());
  }

}

export const netZoneController = new NetZoneController();