import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';



import { mq } from '../../common/mq';


export const Group = () => {
  return (
    <Box className="content-card" sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {JSON.stringify(mq.getZoneSpawns())}
          </Typography>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Box>
  );
};
