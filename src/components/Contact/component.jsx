import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import './component.scss';

export const Contact = () => {
  return (
    <Box className="map-parser-content">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h4" noWrap component="div">
              Contact
          </Typography>
          <br />
          <Card className="map-parser-req-software" variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div">
               Email
              </Typography>
              <Typography variant="p" component="div">
              Feel free to email comments and suggestions to eqadvancedmaps@gmail.com
              </Typography>
              <br />
              <Typography variant="h5" component="div">
               Discord
              </Typography>
              <Typography variant="p" component="div">
              Drop me a line on <a href="https://discord.com/users/162654344875999232" target="_blank" rel="noreferrer">Discord</a>
              </Typography>
              <br />
              <Typography variant="h5" component="div">
               In Game
              </Typography>
              <Typography variant="p" component="div">
               When I'm online nowadays, it's on P99 blue on the characters Knervous, Brutys, or Spaztic. Say hi!
              </Typography>
            </CardContent>
          </Card>
          <br />

          <Typography variant="h4" noWrap component="div">
              About Me
          </Typography>
          <br />
          <Card className="map-parser-req-software" variant="outlined">
            <CardContent>
              <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
              I've been playing EQ on and off since 1999 and started toying with the emulator back when it was part of hackersquest.gomp.ch. 
              Now I enjoy building new tools around an old game to help relive some nostalgia and as added utilities for when I do have time to play ;)
              </Typography>
            </CardContent>
          </Card>
          <br />
        </CardContent>
      
      </Card>
    </Box>
  );
};
