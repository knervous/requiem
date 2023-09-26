import React, { useCallback, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Button, FormControl, Typography } from '@mui/material';
import { GAME_STATES, GlobalStore } from '../../state';
import { OP_CODES, getOpCode, getOpCodeDesc } from '../../net/packet/opcodes';
import * as EQPacket from '../../net/packet/EQPacket';
import { Splash, CssTextField, textFieldClasses } from '../Common/splash';
import { LoginSocket } from '../../net/socket';

const formControlSx = {
  marginTop: 200,
  padding  : '120px 0 0 0',
  width    : 300,
  display  : 'block',
  margin   : '0 auto',
};

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(false);

  const onMessage = useCallback(async (data) => {
    const opc = getOpCode(data);
    switch (opc) {
      case OP_CODES.OP_LoginAccepted: {
        setLoading(false);
        const playerLoginInfo = new EQPacket.PlayerLoginReply(data);
        if (playerLoginInfo.success) {
          setStatus('Fetching servers...');
          GlobalStore.actions.setLoginState(playerLoginInfo.toObject());
          LoginSocket.send(new EQPacket.ServerListRequest(4));
        } else {
          setStatus('Invalid credentials.');
        }
        break;
      }
      case OP_CODES.OP_ServerListResponse: {
        setStatus('Logged in.');
        setLoggedIn(true);
        const lr = new EQPacket.ListServerResponse(data);
        setServers(lr.server_list);
        break;
      }
      case OP_CODES.OP_PlayEverquestResponse: {
        const eqResponse = new EQPacket.PlayEverquestResponse(data);
        GlobalStore.actions.setSelectedServer(eqResponse.server_id);
        GlobalStore.actions.setGameState(GAME_STATES.CHAR_SELECT);
        break;
      }
      default:
        console.warn(
          `Got unhandled login message: ${getOpCodeDesc(data)}`,
          data,
        );
        break;
    }
  }, []);

  const serverLogin = useCallback(
    (serverId) => () => {
      LoginSocket.send(new EQPacket.PlayEverquest([5, false, 0, 0], serverId));
    },
    [],
  );

  const onClose = useCallback(() => {}, []);
  const tryLogin = useCallback(async () => {
    try {
      setLoading(true);
      setStatus('Logging in...');
      await LoginSocket.connect('7775', onMessage, onClose);
      LoginSocket.send(new EQPacket.Login(`${username}:${password}`));
    } catch (e) {
      setStatus('Could not connect to the login server.');
      setLoading(false);
      console.error(e);
    }
  }, [username, password, onMessage, onClose]);

  return (
    <Splash>
      {loggedIn ? (
        <FormControl sx={formControlSx}>
          {servers.length ? (
            <>
              <Typography variant="h6" noWrap component="div">
                Server List
              </Typography>
              <List>
                {servers.map((s) => (
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
              setLoggedIn(false);
              setStatus('');
            }}
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white', marginTop: 2, background: 'rgba(0,0,0, .15)', }}
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
            disabled={loading || !username.length || !password.length}
            onClick={tryLogin}
            variant="outlined"
            sx={{
              background : 'rgba(0,0,0, .15)',
              color      : 'white',
              borderColor: 'white',
              marginTop  : 2,
            }}
          >
            Log In
          </Button>
        </>
      )}
    </Splash>
  );
};
