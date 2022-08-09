import * as React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ListItemText from '@mui/material/ListItemText';
import HouseIcon from '@mui/icons-material/House';

import AccessibilityIcon from '@mui/icons-material/Accessibility';
import GroupIcon from '@mui/icons-material/Group';
import { Character } from '../../Character/component';
import { Zone } from '../../Zone/component';
import { Group } from '../../Group/component';

// scss
import './component.scss';

const processMode = new URLSearchParams(window.location.search).get('mode') === 'process';

export const NavDrawer = ({ handleDrawerClose, setTitle, setContent }) => {
  return <List>
    {[
      ['Character', <AccessibilityIcon />, Character, !processMode],
      ['Advanced Map', <HouseIcon />, Zone, false],
      ['Contact', <ContactMailIcon />, () => <div>  
        <p>Site is a work in progress by temp0. Feel free to email comments and suggestions to eqadvancedmaps@gmail.com</p>

      </div>, false],
      ['Group', <GroupIcon />, Group, !processMode],
    ].map(([text, icon, Content, disabled]) => disabled ? null : (
      <ListItem
        disabled={disabled}
        onClick={() => {
          setTitle(text);
          handleDrawerClose();
          setContent(<Content />);
        }}
        button
        key={text}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    ))}
  </List>;
};
