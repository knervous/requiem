import React, { useCallback } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Button, FormControl, Typography } from '@mui/material';
import { GameState, GlobalStore, useSelector } from '../../state';
import { Splash } from '../Common/splash';
import RaceData from '../../common/raceData.json';
import ClassData from '../../common/classData.json';
import ZoneData from '../../common/zoneData.json';
import { gameController } from '../Babylon/controllers/GameController';

const formControlSx = {
  marginTop: 200,
  padding  : '120px 0 0 0',
  width    : 300,
  display  : 'block',
  margin   : '0 auto',
};

export const CharSelect = () => {
  const loginInfo = useSelector(GameState.loginState);

  const characterLogin = useCallback(
    (name, zoneInfo) => () => {
      gameController.NetWorldController.characterLogin(name, zoneInfo);
    },
    [],
  );

  const createCharacter = useCallback(() => {
    // Need to implement create character
  }, []);

  return (
    <Splash>
      <FormControl sx={formControlSx}>
        {
          <>
            <Typography variant="h7" noWrap component="div">
              Characters
            </Typography>
            {!loginInfo.loading && <List>
              {loginInfo.characters.map((c) => (
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
                      secondary={`Level ${c.level} ${RaceData.find(rd => rd.id === c.race).name} ${ClassData[c.charClass]} - ${ZoneData.find(z => z.zone === c.zone).longName}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              {
                loginInfo.characters.length < 10 ? <ListItem
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
            GlobalStore.actions.resetLogin();
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
