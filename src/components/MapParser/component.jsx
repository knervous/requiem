import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import './component.scss';

const releases = ['0.1.2'];
export const MapParser = () => {
  return (
    <Box className="map-parser-content">
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
            Advanced Map Parser Releases
          </Typography>

          {releases.map(r => <a download href={`/map-parser/AdvancedMapParser-${r}.zip`}>Version {r}</a>)}
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Box>
  );
};
