import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
  Typography
} from '@mui/material';

export const ContactDialog = ({
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
        Contact
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
            Please reach out for any reason: critiques, bugs, ideas, praise. This is a passion project that I always love to discuss. I can be contacted on discord at <Link href="https://discordapp.com/users/162654344875999232">temp0</Link>
          </Typography>

          <Typography
            sx={{ fontSize: 17, marginBottom: 2 }}
            color='text.secondary'
            gutterBottom
          >
            Updates to the project are posted in the <Link href="https://discord.gg/785p886eCw">EQEmu discord</Link> under eqemulator-projects > project-requiem 
          </Typography>
      
          <Typography
            sx={{ fontSize: 17, marginBottom: 2 }}
            color='text.secondary'
            gutterBottom
          >
            I can also be contacted at eqadvancedmaps@gmail.com
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
