import React, { useEffect } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { SettingsContext } from '../Context/settings';
import { useState } from 'react';

export const ConnectionDialog = ({
  connectionOptionsOpen,
  setConnectionOptionsOpen,
  PaperComponent,
  doConnect,
  connected,
  doDisconnect
}) => {
  const {
    setOption,
    address,
    autoConnect,
    processMode,
    token,
    version
  } = React.useContext(SettingsContext);
  const [connectStatus, setConnectStatus] = useState('None');
  useEffect(() => {
    if (connected) {
      setConnectStatus('Connected');
      return;
    }
    (async () => {
      try {
        await fetch(address.replace('wss', 'https')).then(_r => {});
        setConnectStatus('Server is running. Ready to connect.');
        return;
      } catch (e) {
        setConnectStatus(
          'No response. Make sure the server is running and try troubleshooting tips below.'
        );
        console.warn('Error', e.message);
      }
    })();
  }, [address, connected, connectionOptionsOpen]);

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      open={connectionOptionsOpen}
      onClose={() => setConnectionOptionsOpen(false)}
      PaperComponent={PaperComponent}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
        Connection
      </DialogTitle>
      <DialogContent>
        <div className='connection-content'>
          <Stack
            alignContent='center'
            justifyContent='space-between'
            direction='row'
            spacing={1}
          >
            <TextField
              sx={{ width: '50%' }}
              onChange={({ target: { value } }) => setOption('address', value)}
              label='Server Address'
              placeholder='https://localhost:4500'
              value={address}
            />
            <Button
              sx={{
                color     : 'black',
                background: 'lightgreen',
                width     : '50%',
                height    : 55
              }}
              variant='outlined'
              onClick={() =>
                window.open(address.replace('wss', 'https'), '_blank').focus()
              }
            >
              Launch Tab to Override
            </Button>
          </Stack>

          <Typography
            sx={{ fontSize: 14, marginBottom: 15 }}
            color='text.secondary'
            gutterBottom
          >
            Connection Status: {connectStatus}
          </Typography>
          {processMode && (
            <div><TextField
              sx={{ marginTop: 3, marginBottom: 3 }}
              fullWidth
              onChange={({ target: { value } }) => setOption('token', value)}
              label='Token'
              placeholder=''
              multiline
              value={token}
            />
            <FormControl sx={{ marginTop: 1 }} fullWidth>
              <InputLabel id="demo-simple-select-label">Game Version</InputLabel>
              <Select
                value={version ?? ''}
                label="Skybox"
                displayEmpty
                onChange={({ target: { value } }) => setOption('version', value)}
              >
                {['live', 'titanium'].map((p, i) => (
                  <MenuItem key={`version-${i}`} value={p}>
                    {p === 'live' && 'Live'}
                    {p === 'titanium' && 'Titanium (P99)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </div>
          )}
          <br />
          <details>
            <summary style={{ padding: 5 }}>Troubleshooting</summary>

            <Typography
              sx={{ fontSize: 14 }}
              color='text.secondary'
              gutterBottom
            >
              The AdvancedMapParser runs a local server with a self-signed
              certificate to communicate with the browser. By default, these
              types of certificates are disallowed by modern browsers. You can
              bypass this setting with the following workarounds.
            </Typography>
            <br />
            <Typography
              sx={{ fontSize: 14 }}
              color='text.secondary'
              gutterBottom
            >
              Chrome override
            </Typography>
            <img src='/img/chrome-override.png' width={600} alt='' />
            <br />
            <Typography
              sx={{ fontSize: 14 }}
              color='text.secondary'
              gutterBottom
            >
              FireFox override
            </Typography>
            <img src='/img/ff-override.png' width={600} alt='' />
          </details>
          <br />
         
        </div>
      </DialogContent>
      <DialogActions>
        <FormControlLabel
          control={
            <Checkbox
              checked={autoConnect}
              onChange={({ target: { checked } }) =>
                setOption('autoConnect', checked)
              }
            />
          }
          label='Auto-Connect'
        />
        <Button autoFocus onClick={() => setConnectionOptionsOpen(false)}>
          Cancel
        </Button>
        <Button autoFocus onClick={doDisconnect}>
          Disconnect
        </Button>
        <Button autoFocus onClick={doConnect}>
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
};
