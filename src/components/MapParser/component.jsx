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
          <Typography variant="h4" noWrap component="div">
              Latest Version: {version}
          </Typography>
          <br />
          {/* <Card className="map-parser-req-software" variant="outlined"> */}
          <img width={'90%'} src="/img/amp-cover2.png" alt="cover" />
          {/* </Card> */}

          <Card className="map-parser-req-software" variant="outlined">
            <CardContent>
              <Typography variant="h4" component="div">
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
        
          <Card className="map-parser-installation" variant="outlined">
            <CardContent>
              <Typography variant="h4" component="div">
               First time setup
              </Typography>
              <Typography className="map-parser-installation-steps" sx={{ fontSize: 18 }} gutterBottom component="div">
               1. Extract the Map Parser contents into your EverQuest logs folder. An example would be C:/Program Files (x86)/Sony/EverQuest/Logs <br/> 
               2. Start AdvancedMapParser.exe. This should guide you through some prompts and eventually open a command console.<br/> 
               3. Copy the address in the command console for the local server, default of wss://127.0.0.1:9004. You can also connect via LAN by the network address. <br/> 
               4. While in game, type the /log command to start logging. If there are no log files try this link to troubleshoot <a href="https://wiki.project1999.com/Logfiles" target="_blank" rel="noreferrer">https://wiki.project1999.com/Logfiles</a><br/> 
               5. Create a hotkey that runs the /loc command. People generally double bind this to a frequently used key like A or D to automatically execute /loc. <br/> 
               6. Open the Advanced Map Parser on this site and press "Connect EQ". Paste in the address from the AdvancedMapParser console. <br/>
               7. Click the "Launch Tab to Override" button and follow instructions in the troubleshooting section<br/>
               8. Once you've seen the message "Successfully connected!" you can return to the EQ Advanced Map website and click "Connect" in the connection dialog.
               9. You're connected! Now any /loc command in game should update your character's zone and location.
              </Typography>
            </CardContent>
          </Card>
          <br />

          <Card className="map-parser-installation" variant="outlined">
            <CardContent>
              <Typography variant="h4" component="div">
                Next Time Use
              </Typography>
              <Typography className="map-parser-installation-steps" sx={{ fontSize: 18 }} gutterBottom component="div">
               1. If you've successfully installed and connected previously, just make sure your AdvancedMapTool.exe is running<br/> 
               2. Load up the EQ Advanced Map in your browser. You should connect automatically. If you don't, try the "Launch Tab to Override" button in the Connect dialog.<br/> 
              </Typography>
            </CardContent>
          </Card>
          <br />

        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Box>
  );
};
