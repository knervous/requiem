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
          height        : '100%',
          background    : 'center no-repeat url(/img/requiem-splash6.png)',
          backgroundSize: 'cover'
        }}
      >
        <CardContent>
          <img src="/brand/png/logo-no-background.png" width={400} alt="logo" />
          {children}
        </CardContent>
      </Card>
    </StyledBox>
  );
};
