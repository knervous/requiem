import React, { useCallback, useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Button, FormControl, Typography } from '@mui/material';
import { GAME_STATES, GameState, GlobalStore, useSelector } from '../../state';
import { OP_CODES, getOpCode, getOpCodeDesc } from '../../net/packet/opcodes';
import * as EQPacket from '../../net/packet/EQPacket';
import { Splash } from '../Common/splash';
import { WorldSocket } from '../../net/socket';
import RaceData from '../../common/raceData.json';
import ClassData from '../../common/classData.json';
import ZoneData from '../../common/zoneData.json';

const formControlSx = {
  marginTop: 200,
  padding  : '120px 0 0 0',
  width    : 300,
  display  : 'block',
  margin   : '0 auto',
};

export const CharSelect = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState([]);

  const loginInfo = useSelector(GameState.loginState);
  const onMessage = useCallback(async (data) => {
    const opc = getOpCode(data);
    switch (opc) {
      case OP_CODES.OP_SendCharInfo: {
        const charInfo = new EQPacket.CharacterSelectEntry(data);
        console.log('Char info', charInfo);
        setCharacters(charInfo.characters);
        setStatus('');
        setLoading(false);
        break;
      }
      case OP_CODES.OP_ZoneServerInfo:
        const zoneInfo = new EQPacket.ZoneInfo(data);
        GlobalStore.actions.setZonePort(zoneInfo.port);
        break;
      default:
        console.warn(
          `Got unhandled world message: ${getOpCodeDesc(data)}`,
          data,
        );
        break;
    }
  }, []);

  const onClose = useCallback(() => {}, []);

  const characterLogin = useCallback(
    (name, zoneInfo) => () => {
      GlobalStore.actions.setZoneInfo(zoneInfo);
      GlobalStore.actions.setGameState(GAME_STATES.IN_ZONE);
      GlobalStore.actions.setCharacter(name);
      WorldSocket.send(new EQPacket.EnterWorld(name, false, false));
    },
    [],
  );

  const createCharacter = useCallback(() => {}, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setStatus('Fetching characters...');
        await WorldSocket.connect('7777', onMessage, onClose);
        WorldSocket.send(
          new EQPacket.LoginInfo(
            [loginInfo.lsid.toString(), loginInfo.key],
            false,
          ),
        );
      } catch (e) {
        setStatus('Could not connect to the world server.');
        setLoading(false);
        console.error(e);
      }
    })();
  }, [loginInfo, onClose, onMessage]);

  return (
    <Splash>
      <FormControl sx={formControlSx}>
        {
          <>
            <Typography variant="h7" noWrap component="div">
              {status}
            </Typography>
            {!loading && <List>
              {characters.map((c) => (
                <ListItem
                  disablePadding
                  sx={{
                    background  : 'rgba(0,0,0, .15)',
                    borderRadius: 1,
                    border      : '1px solid lightgrey',
                  }}
                  key={`char-${c.name}`}
                >
                  <ListItemButton onClick={characterLogin(c.name, ZoneData.find(z => z.zone === c.zone))}>
                    <ListItemText
                      sx={{
                        span: {
                          fontSize: 20,
                        },
                      }}
                      primary={c.name}
                      secondary={`Level ${c.level} ${RaceData.find(rd => rd.id === c.race).name} ${ClassData[c.class]} - ${ZoneData.find(z => z.zone === c.zone).longName}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              {
                characters.length < 10 ? <ListItem
                  disablePadding
                  sx={{
                    background  : 'rgba(0,0,0, .15)',
                    borderRadius: 1,
                    border      : '1px solid lightgrey',
                  }}
                  key={'char-create'}
                >
                  <ListItemButton onClick={createCharacter}>
                    <ListItemText
                      sx={{
                        span: {
                          fontSize: 20,
                        },
                      }}
                      primary="Create a new character"
                    />
                  </ListItemButton>
                </ListItem> : null
              }
            </List>}
            
          </>
        }
        <Button
          onClick={() => {
            GlobalStore.actions.setGameState(GAME_STATES.LOGIN);
          }}
          variant="outlined"
          sx={{
            color      : 'white',
            borderColor: 'white',
            marginTop  : 2,
            background : 'rgba(0,0,0, .15)',
          }}
        >
          Back to login
        </Button>
      </FormControl>
    </Splash>
  );
};
