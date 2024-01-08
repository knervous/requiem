import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useConfirm } from 'material-ui-confirm';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Button, FormControl, Typography } from '@mui/material';
import { GlobalStore } from '../../state';
import ClassData from '../../common/classData.json';
import ZoneData from '../../common/zoneData.json';
import { gameController } from '../Babylon/controllers/GameController';
import { VIEWS } from './constants';
import supportedZones from '../../common/supportedZones.json';

const formControlSx = {
  marginTop: 200,
  padding  : '120px 0 0 0',
  width    : 300,
  display  : 'block',
  margin   : '0 auto',
};

export const CharacterSelect = ({ loginInfo, babylonLoaded, setView }) => {
  const [selectedChar, setSelectedChar] = useState(
    loginInfo.characters?.[0] ?? null
  );

  useEffect(() => {
    setSelectedChar(loginInfo.characters?.[0] ?? null);
  }, [loginInfo.characters]);

  const confirm = useConfirm();

  useEffect(() => {
    if (!babylonLoaded) {
      return;
    }

    if (selectedChar === null) {
      gameController.CameraController.swapCharacterSelectView(
        gameController.CameraController.VIEWS.GOOD
      );
      return;
    }

    let pos = { x: 0, y: 0, z: 16 };
    let size = 15;
    let heading = 0;
    const goodRaces = [1, 2, 3, 4, 5, 7, 8, 11];
    const bigRaces = [2, 9, 10];
    if (goodRaces.includes(selectedChar.race)) {
      gameController.CameraController.swapCharacterSelectView(
        gameController.CameraController.VIEWS.GOOD
      );
    } else {
      gameController.CameraController.swapCharacterSelectView(
        gameController.CameraController.VIEWS.EVIL
      );
      pos = { x: -315, y: -2.18, z: 15 };
      heading = 180;
    }
    if (bigRaces.includes(selectedChar.race)) {
      size = 20;
      pos.z += 3;
    }
    const name = `${selectedChar.name} [${selectedChar.level} ${
      ClassData[selectedChar.charClass]
    }]`;
    gameController.SpawnController.setCharacterSelectModel({
      ...selectedChar,
      size,
      ...pos,
      heading,
      name,
    });
  }, [selectedChar, babylonLoaded]);

  const characterLogin = useCallback(() => {
    if (!selectedChar) {
      return;
    }

    confirm({
      description:
        'Live zones are a work in progress and currently unavailable. Do you want to enter the demo?',
      title: 'Enter Demo',
    })
      .then(() => {
        GlobalStore.actions.setExploreMode();
        const zone = supportedZones[selectedChar.zone];
        GlobalStore.actions.setZoneInfo({ ...zone, zone: selectedChar.zone });
      })
      .catch(() => {});
  }, [selectedChar, confirm]);

  const characterDelete = useCallback(() => {
    if (!selectedChar) {
      return;
    }
    confirm({
      title      : 'Delete Character',
      description: `Are you sure you want to delete ${selectedChar.name}? This cannot be undone.`,
    })
      .then(() => {
        gameController.NetWorldController.characterDelete(selectedChar.name);
      })
      .catch(() => {});
  }, [selectedChar, confirm]);

  const createCharacter = useCallback(() => {
    setView(VIEWS.CHAR_CREATE);
  }, [setView]);

  const charSelectNum = useMemo(() => {
    return 8 - loginInfo?.characters?.length ?? 0;
  }, [loginInfo?.characters?.length]);
  return (
    <>
      <FormControl className="char-list" sx={formControlSx}>
        <Typography variant="h7" noWrap component="div">
          Characters
        </Typography>
        {!loginInfo.loading && (
          <List>
            {loginInfo.characters.map((c) => (
              <ListItem
                disablePadding
                sx={{
                  background:
                    selectedChar?.name === c.name
                      ? 'rgba(0,0,0,0.75) !important'
                      : 'rgba(0,0,0, .15)',
                  borderRadius: 1,
                  border      : '1px solid lightgrey',
                }}
                key={`char-${c.name}`}
              >
                <ListItemButton
                  onClick={() => {
                    setSelectedChar(c);
                  }}
                >
                  <ListItemText
                    sx={{
                      span: {
                        fontSize: 20,
                      },
                    }}
                    primary={c.name}
                    secondary={`${
                      ZoneData.find((z) => z.zone === c.zone).longName
                    }`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            {Array.from({ length: charSelectNum }, () => (
              <ListItem
                disablePadding
                sx={{
                  background  : 'rgba(0,0,0, .15)',
                  borderRadius: 1,
                  border      : '1px solid lightgrey',
                  minHeight   : '60px',
                }}
              >
                <ListItemButton onClick={createCharacter}>
                  <ListItemText
                    sx={{
                      span: {
                        fontSize : 20,
                        textAlign: 'center',
                      },
                    }}
                    primary="Create a new character"
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}

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

        <Button
          onClick={characterLogin}
          variant="outlined"
          disabled={selectedChar === null}
          sx={{
            color      : 'white',
            borderColor: 'white',
            marginTop  : 2,
            background : 'rgba(0,0,0, .15)',
          }}
        >
          Enter World
        </Button>
        {selectedChar !== null && (
          <Button
            onClick={characterDelete}
            variant="outlined"
            disabled={selectedChar === null}
            sx={{
              color      : 'white',
              borderColor: 'white',
              marginTop  : 2,
              background : 'rgba(0,0,0, .15)',
            }}
          >
            Delete Character
          </Button>
        )}
      </FormControl>
    </>
  );
};
