import React, { useCallback, useMemo, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Splash, CssTextField, textFieldClasses } from '../Common/splash';
import { gameController } from '../Babylon/controllers/GameController';
import { GameState, GlobalStore, useSelector } from '../../state';
import { AboutDialog } from '../Dialogs/about';
import supportedZones from '../../common/supportedZones.json';
import { ContactDialog } from '../Dialogs/contact';
import { AcknowledgementsDialog } from '../Dialogs/acknowledgements';

const formControlSx = {
  marginTop: 200,
  padding  : '40px 0 0 0',
  width    : 300,
  display  : 'block',
  margin   : '0 auto',
};

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [demoZone, setDemoZone] = useState(1);

  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [ackOpen, setAckopen] = useState(false);

  const loginState = useSelector(GameState.loginState);

  const status = useMemo(() => {
    if (!loginState.triedLogin) {
      return '';
    }
    if (loginState.loggedIn) {
      return 'Logged in';
    }
    return loginState.success ? 'Fetching servers...' : 'Invalid credentials';
  }, [loginState]);

  const serverLogin = useCallback(
    (serverId) => () => {
      gameController.NetLoginController.serverLogin(serverId);
    },
    []
  );

  const tryLogin = useCallback(() => {
    GlobalStore.actions.setLoginState({ loading: true });
    gameController.NetLoginController.login(username, password);
  }, [username, password]);

  return (
    <Splash>
      <AboutDialog open={aboutOpen} setOpen={setAboutOpen} />
      <ContactDialog open={contactOpen} setOpen={setContactOpen} />
      <AcknowledgementsDialog open={ackOpen} setOpen={setAckopen} />
      {loginState.loggedIn ? (
        <FormControl sx={formControlSx}>
          {loginState.serverList.length ? (
            <>
              <Typography variant="h6" noWrap component="div">
                Server List
              </Typography>
              <List>
                {loginState.serverList.map((s) => (
                  <ListItem
                    disablePadding
                    sx={{
                      background  : 'rgba(0,0,0, .15)',
                      borderRadius: 1,
                      border      : '1px solid lightgrey',
                    }}
                    key={`server-${s.server_id}`}
                  >
                    <ListItemButton onClick={serverLogin(s.server_id)}>
                      <ListItemText
                        sx={{
                          span: {
                            fontSize: 20,
                          },
                        }}
                        primary={s.server_name}
                        secondary={`${s.players_online} players online`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Typography variant="h5" noWrap component="div">
              No servers online.
            </Typography>
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
        </FormControl>
      ) : (
        <>
          <FormControl sx={formControlSx}>
            <CssTextField
              autoComplete="on"
              label="Username"
              variant="outlined"
              value={username}
              onChange={({ target: { value } }) => setUsername(value)}
              sx={{
                margin    : '5px 0',
                label     : { color: 'white', fontSize: 18 },
                input     : { color: 'white' },
                background: 'rgba(0,0,0, .15)',
              }}
              classes={{
                root: textFieldClasses.root,
              }}
            />
            <CssTextField
              autoComplete="on"
              label="Password"
              type="password"
              value={password}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  tryLogin();
                }
              }}
              variant="outlined"
              onChange={({ target: { value } }) => setPassword(value)}
              sx={{
                label     : { color: 'white', fontSize: 18 },
                input     : { color: 'white' },
                background: 'rgba(0,0,0, .15)',
              }}
              classes={{
                root: textFieldClasses.root,
              }}
            />
          </FormControl>
          <Typography variant="h7" noWrap component="div">
            {status}
          </Typography>
          <Button
            disabled={
              !gameController.dev ||
              loginState.loading ||
              !username.length ||
              !password.length
            }
            onClick={tryLogin}
            variant="outlined"
            sx={{
              background : 'rgba(0,0,0, .15)',
              color      : 'white',
              borderColor: 'white',
              marginTop  : 2,
            }}
          >
            {gameController.dev ? 'Log In' : 'Not Available'}
          </Button>

          <Stack
            direction="row"
            sx={{ width: '300px', margin: '20px auto 40px auto' }}
            justifyContent="center"
            spacing={2}
          >
            <FormControl>
              <Select
                value={demoZone}
                sx={{ background: 'rgba(0,0,0, 0.25)', margin: '5px 0' }}
                onChange={(e) => setDemoZone(e.target.value)}
              >
                {Object.entries(supportedZones).map(([zoneId, { longName, shortName }]) => (
                  <MenuItem value={zoneId}>
                    {longName} :: {shortName}
                  </MenuItem>
                ))}
              </Select>
              <Button
                onClick={() => {
                  GlobalStore.actions.setExploreMode();
                  const zone = supportedZones[demoZone];
                  GlobalStore.actions.setZoneInfo({ ...zone, zone: demoZone });
                }}
                variant="outlined"
                sx={{
                  color     : 'white',
                  background: 'rgba(0,0,0, .25)',
                }}
              >
                Explore demo
              </Button>
            </FormControl>
          </Stack>
          <Stack
            sx={{ width: 'auto' }}
            justifyContent="center"
            spacing={2}
          >

            <Typography onClick={() => {
              setAboutOpen(true);
            }} variant="h5" sx={{ textDecoration: 'underline', '&:hover': { textDecoration: 'none' } }}>
              Vision
            </Typography>

            <Typography onClick={() => {
              setContactOpen(true);
            }} variant="h5" sx={{ textDecoration: 'underline', '&:hover': { textDecoration: 'none' } }}>
              Contact
            </Typography>
            <Typography onClick={() => {
              setAckopen(true);
            }} variant="h5" sx={{ textDecoration: 'underline', '&:hover': { textDecoration: 'none' } }}>
              Acknowledgements
            </Typography>
      
          </Stack>
          
        </>
      )}
    </Splash>
  );
};
