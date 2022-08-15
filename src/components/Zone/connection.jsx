import React, { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { SettingsContext } from '../Context/settings';
import { useState } from 'react';

export const ConnectionDialog = ({
  connectionOptionsOpen,
  setConnectionOptionsOpen,
  PaperComponent,
  doConnect,
  connected,
}) => {
  const { setOption, address } = React.useContext(SettingsContext);
  const [connectStatus, setConnectStatus] = useState('None');
  useEffect(() => {
    if (connected) {
      setConnectStatus('Connected');
    }
    (async () => {
      try {
        const res = await fetch(address.replace('wss', 'https')).then((r) => {
          console.log('Response', r);
        });
        setConnectStatus('Server is running. Ready to connect.');
      } catch (e) {
        setConnectStatus(
          'No response. Make sure the server is running and try troubleshooting tips below.',
        );
        console.log('Error', e.message);
      }
    })();
  }, [address, connected, connectionOptionsOpen]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={connectionOptionsOpen}
      onClose={() => setConnectionOptionsOpen(false)}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        Connection
      </DialogTitle>
      <DialogContent>
        <div className="connection-content">
          <TextField
            sx={{ marginTop: 5 }}
            fullWidth
            onChange={({ target: { value } }) => setOption('address', value)}
            label="Server Address"
            placeholder="https://localhost:4500"
            value={address}
          />
          <Typography
            sx={{ fontSize: 14, marginBottom: 15 }}
            color="text.secondary"
            gutterBottom
          >
            Connection Status: {connectStatus}
          </Typography>
          <details>
            <summary style={{ padding: 5 }}>Troubleshooting</summary>
            
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              The AdvancedMapParser runs a local server with a self-signed
              certificate to communicate with the browser. By default, these
              types of certificates are disallowed by modern browsers. You can
              bypass this setting with the following workarounds.
            </Typography>
            <br />
            <Button
              sx={{ color: 'black', margin: '10 0', background: 'lightgreen' }}
              variant="outlined"
              onClick={() =>
                window.open(address.replace('wss', 'https'), '_blank').focus()
              }
            >
              Launch Tab to Override
            </Button>
            <br />
            <br />
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Chrome override
            </Typography>
            <img src="/img/chrome-override.png" width={600} alt="" />
            <br />
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              FireFox override
            </Typography>
            <img src="/img/ff-override.png" width={600} alt="" />
          </details>
          <br />

          {/* <TextField
          fullWidth
          onChange={({ target: { value } }) =>
            setOption('token', value)
          }
          label="Token"
          placeholder=""
          multiline
          value={token}
        /> */}
        </div>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => setConnectionOptionsOpen(false)}>
          Cancel
        </Button>
        <Button autoFocus onClick={doConnect}>
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
};
