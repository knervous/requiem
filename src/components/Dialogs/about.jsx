import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

export const AboutDialog = ({ open, setOpen }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle
        style={{ cursor: 'move', margin: '0 auto' }}
        id="draggable-dialog-title"
      >
        Welcome to EQ: Requiem!
      </DialogTitle>
      <DialogContent>
        <div>
          <Stack
            alignContent="center"
            justifyContent="space-between"
            direction="row"
            spacing={1}
          ></Stack>

          <Typography
            sx={{ fontSize: 17, marginBottom: 2 }}
            color="text.secondary"
            gutterBottom
          >
            EQ Requiem is a project with many ambitions. Firstly, it's what you
            see right here: A playable version of EverQuest in the browser. It
            will also be cross compatible with the EQEmu login server and
            clients, allowing players to log in from the client and device of
            their choice.
          </Typography>
          <Typography
            sx={{ fontSize: 17, marginBottom: 2 }}
            color="text.secondary"
            gutterBottom
          >
            The server itself will be a Classic+ concept. The level cap will be
            50 with all original content up to the first expansion. The custom
            content on the server aims to give more depth to main cities and
            more options for hunting and questing.
          </Typography>

          <Typography
            sx={{ fontSize: 17, marginBottom: 2 }}
            color="text.secondary"
            gutterBottom
          >
            The demo included in this page will be under construction and
            reflect the experience of moving in the world during actual
            gameplay. All features in the demo are subject to change at any
            time. Here is a list of useful hotkeys:
            <br />
            <br />
            I : Toggle BabylonJS inspector
            <br />
            C : Toggle Collision
            <br />
            G : Toggle Gravity
            <br />
            U : Toggle UI
            <br />
            Shift: Toggle fast run speed
          </Typography>
          <Typography
            sx={{ fontSize: 17, marginBottom: 2 }}
            color="text.secondary"
            gutterBottom
          >
            Enjoy your time in Norrath in the web and hope to see you online one
            day soon!
          </Typography>

          <Typography
            sx={{ fontSize: 17, marginBottom: 2 }}
            color="text.secondary"
            gutterBottom
          >
            - temp0
          </Typography>
        </div>
      </DialogContent>
      <DialogActions disableSpacing sx={{ margin: '0 auto' }}>
        <Button
          sx={{ color: 'white' }}
          variant="outlined"
          autoFocus
          onClick={() => setOpen(false)}
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};
