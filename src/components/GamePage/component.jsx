import React, { useState, useMemo } from 'react';
import ReactMidiPlayer from 'react-midi-player';

import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import classnames from 'classnames';

import { GAME_STATES, GameState, useSelector } from '../../state';
import { Login } from '../Login/component';
import { Zone } from '../Zone/component';
import { CharSelect } from '../CharacterSelect';
import { SettingsDrawer } from './settings';

// scss
import './component.scss';


const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow  : 1,
    padding   : theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing  : theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing  : theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing  : theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width     : `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing  : theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display       : 'flex',
  alignItems    : 'center',
  padding       : theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export const GamePage = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const gameState = useSelector(GameState.state);

  const content = useMemo(() => {
    return <Zone />;
    switch (gameState) {
      
      case GAME_STATES.IN_ZONE:
        return <Zone />;
      case GAME_STATES.CHAR_SELECT:
        return <CharSelect />;
      case GAME_STATES.LOGIN:
      default:
        return <Login />;
    }
  }, [gameState]);
  const handleDrawerOpen = (type) => () => {
    setOpen(type);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return true ? content : (
    <div className='dashboard-content'>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen('settings')}
              edge="start"
              sx={{ borderRadius: 2, mr: 2, ...(open && { display: 'none' }) }}
            >
              <SettingsIcon />
              <Typography
                sx={{ marginLeft: 1, fontSize: 16 }}
              >
            Settings
              </Typography>
            </IconButton>
            <div className="paypal-donate" style={{ float: 'right', display: 'inline', position: 'absolute', right: 15, top: 12 }}
            >
              <ReactMidiPlayer src='midi/erudnext 3.mid' />
            </div>
         
          </Toolbar>
        </AppBar>
        <Drawer
          className="left-drawer"
          sx={{
            width               : drawerWidth,
            flexShrink          : 0,
            '& .MuiDrawer-paper': {
              width    : drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader sx={{ justifyContent: 'space-between' }}>
            <h3 style={{ marginLeft: 8 }}>
              {'Settings'}
            </h3>
            <IconButton sx={{ borderRadius: 2 }} onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
              <Typography
                sx={{ marginLeft: 1, fontSize: 16 }}
              >
              Back
              </Typography>
            </IconButton>
         
          </DrawerHeader>
          <Divider />
          {open === 'settings' && (
            <SettingsDrawer
              handleDrawerClose={handleDrawerClose}
            />
          )}
        </Drawer>
        <Main className="main-content" open={open}>
          <DrawerHeader />
          {content}
        </Main>
      </Box>
    </div>
  );
};
