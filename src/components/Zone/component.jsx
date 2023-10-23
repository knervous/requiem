import React from 'react';


import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';

import { BabylonZone } from '../Babylon/Zone';
import './component.scss';

export const Zone = () => {
  return (
    <Paper className='zone-container' elevation={1}>
      <Card className='zone-header' variant='outlined'>
        <CardContent className='zone-header'>
          <BabylonZone />
        </CardContent>
      </Card>
    </Paper>
  );
};
