import React, {
  useEffect,
  useCallback
} from 'react';


import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';

import { BabylonZone } from '../Babylon/Zone';
import * as ZonePacket from '../../net/packet/ZonePackets';
import { GlobalStore, ZoneState, useSelector } from '../../state';
import { OP_CODES, getOpCode, getOpCodeDesc } from '../../net/packet/opcodes';
import { ZoneSocket } from '../../net/socket';

import './component.scss';
import UiOverlay from '../Ui/component';


export const Zone = () => {
  const character = useSelector(ZoneState.character);
  const zonePort = useSelector(ZoneState.zonePort);

  const onMessage = useCallback(async data => {
    const opc = getOpCode(data);
    switch (opc) {
      case OP_CODES.OP_ZoneSpawns: {
        const { spawns } = new ZonePacket.ZoneSpawns(data).toObject();
        GlobalStore.actions.clearZoneSpawns();
        GlobalStore.actions.addZoneSpawns(spawns);
        break;
      }
      case OP_CODES.OP_ClientUpdate:{
        const update = new ZonePacket.SpawnPositionUpdate(data).toObject();
        GlobalStore.actions.updateZoneSpawn(update);
        break;
      }
      case OP_CODES.OP_DeleteSpawn: {
        const id = new ZonePacket.SpawnDelete(data).toObject().spawn_id;
        GlobalStore.actions.removeZoneSpawns([id]);
        break;
      }
      case OP_CODES.OP_NewSpawn:
        const newSpawn = new ZonePacket.Spawn(data).toObject();
        GlobalStore.actions.addZoneSpawns([newSpawn]);
        break;
      case OP_CODES.OP_ChannelMessage:
        const message = new ZonePacket.ChannelMessage(data).toObject();
        GlobalStore.actions.addChatLine(message);
        break;
      default:
        console.warn(`Got unhandled zone message: ${getOpCodeDesc(data)}`, data);
        break;
    }
  }, []);

  
  const onClose = useCallback(() => {}, []);
  const connect = useCallback(async () => {
    if (zonePort !== -1) {
      try {
        await ZoneSocket.connect(zonePort, onMessage, onClose);
        console.log('connected');
        ZoneSocket.send(new ZonePacket.ZoneEntry(0, character));
        ZoneSocket.send(new ZonePacket.ZoneClientReady());
      } catch (e) {
        console.error(e);
      }
    }
  }, [zonePort, onClose, onMessage, character]);

  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <Paper className='zone-container' elevation={1}>
      <Card className='zone-header' variant='outlined'>
        <CardContent className='zone-header'>
          <BabylonZone />

        </CardContent>
      </Card>
    </Paper>
  );
};
