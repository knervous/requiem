import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from '@mui/material';

export const AboutDialog = ({
  open,
  setOpen
}) => {
  return (
    <Dialog
      fullWidth
      maxWidth='sm'
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle style={{ cursor: 'move', margin: '0 auto' }} id='draggable-dialog-title'>
        Welcome to EQ: Requiem!
      </DialogTitle>
      <DialogContent>
        <div>
          <Stack
            alignContent='center'
            justifyContent='space-between'
            direction='row'
            spacing={1}
          >

          </Stack>

          <Typography
            sx={{ fontSize: 17, marginBottom: 2 }}
            color='text.secondary'
            gutterBottom
          >
            EQ Requiem is a project with many ambitions. Firstly, it's what you see right here: A playable version of EverQuest in the browser.
            It will also be cross compatible with the EQEmu login server and clients, allowing players to log in from the client and device of their choice.
          </Typography>
          <Typography
            sx={{ fontSize: 17, marginBottom: 2 }}
            color='text.secondary'
            gutterBottom
          >
            The server itself will be a Classic+ concept. The level cap will be 50 with all original content up to the first expansion. 
            The custom content on the server aims to give more depth to main cities and more options for hunting and questing.
          </Typography>
         
        </div>
      </DialogContent>
      <DialogActions disableSpacing sx={{ margin: '0 auto' }}>
        <Button sx={{ color: 'white' }} variant='outlined' autoFocus onClick={() => setOpen(false)}>
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};
