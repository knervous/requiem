import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import './component.scss';
import { Button } from '@mui/material';

const dotNetLink = 'https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/runtime-desktop-5.0.17-windows-x64-installer';

const version = '0.1.3';

export const MapParser = () => {
  return (
    <Box className="map-parser-content">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3" noWrap component="div">
              Advanced Map Parser
          </Typography>
          <Typography variant="h5" noWrap component="div">
              Latest Version: {version}
          </Typography>
          <br />
          {/* <Card className="map-parser-req-software" variant="outlined"> */}
          <img width={'90%'} src="/img/amp-cover2.png" alt="cover" />
          {/* </Card> */}

          <Card className="map-parser-req-software" variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div">
               Required Software
              </Typography>
              <Typography variant="p" component="div">
               The .NET Desktop Runtime is required to run the Advanced Map Parser. <br/> Below are download links for both the runtime and the latest version of the tool.
              </Typography>
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
              <Button target="_blank" href={dotNetLink} size="large">Download the .NET Runtime</Button>
              <Button download href={`/map-parser/AdvancedMapParser-${version}.zip`} size="large">Download Advanced Map Parser {version}</Button>
            </CardActions>
          </Card>
          <br />
          <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
            Advanced Map Parser Latest Release
          </Typography>

        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Box>
  );
};
