import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { TextField } from '@mui/material';


const PREFIX = 'Splash';
export const textFieldClasses = {
  root: `${PREFIX}-root`,
};
const StyledBox = styled(Box)({
  [`& .${textFieldClasses.root}`]: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset'      : {},
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  },
});

export const CssTextField = TextField;
export const Splash = ({ children }) => {
  return (
    <StyledBox className="content-card" sx={{ minWidth: 275, height: '100%' }}>
      <Card
        variant="outlined"
        sx={{
          position      : 'fixed',
          height        : '100vh',
          width         : '100vw',
          maxHeight     : '100vh',
          overflowY     : 'scroll',
          background    : 'center no-repeat url(/img/requiem-splash6.png)',
          backgroundSize: 'cover'
        }}
      >
        <CardContent>
          <img src="/brand/png/logo-no-background.png" width={400} alt="logo" />
          {children}
        </CardContent>
        <footer style={{ position: 'fixed', bottom: 15, left: 15, textAlign: 'left', maxWidth: '35%' }}>	
  EverQuest is a registered trademark of Daybreak Game Company LLC.
          <br/>
  EQ Requiem is not associated or affiliated in any way with Daybreak Game Company LLC.</footer>
      </Card>
   
    </StyledBox>
  );
};
