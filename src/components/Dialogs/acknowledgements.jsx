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

export const AcknowledgementsDialog = ({
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
        Acknowledgements
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
            This project has been many years in the making from a proof of concept standpoint. It wouldn't be possible without the thousands of hours of research and labor from other passionate
            developers. Thank you to the devs on the following projects:

            <br/>
            <br/>
            Project Lantern: The work done decompiling the older clients and on streamlining the extraction process of legacy assets is an invaluable asset to the EQ dev community.
            <br/>
            <br/>
            EQEmu / ProjectEQ: They are the life blood of EQ emulation and the work they've done makes my job on this project infinitely easier.
            <br/>
            <br/>
            MacroQuest2: The time spent understanding underlying code in the client has given me a perspective that I could not approach this project without. MQ provides a looking glass to
            client internals that helps demystify how older games used to work.
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
