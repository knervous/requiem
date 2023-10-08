import React, { useRef } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { ConfirmProvider } from 'material-ui-confirm';

import { GamePage } from '../GamePage';
import {
  DefaultToast,
  ToastProvider,

} from 'react-toast-notifications';
import { SettingsProvider } from '../Context/settings';
import './component.scss';

const CustomToast = ({ children, ...props }) => {
  const myToast = useRef(null);
  const callback = (event) => {
    for (const node of Array.from(
      document.querySelectorAll('.react-toast-notifications__toast')
    )) {
      if (node.contains(myToast.current)) {
        continue;
      }
      const key = Object.keys(node).find((n) =>
        n.startsWith('__reactEventHandlers')
      );
      if (key) {
        const fn =
          node[key][
            event.type === 'mouseenter' ? 'onMouseEnter' : 'onMouseLeave'
          ];
        if (typeof fn === 'function') {
          fn();
        }
      }
    }
  };

  return (
    <DefaultToast {...props}>
      <div
        ref={myToast}
        aria-atomic="true"
        role="alert"
        onMouseEnter={callback}
        onMouseLeave={callback}
      >
        
        {children}
      </div>
    </DefaultToast>
  );
};

export const Main = () => {
  return (
    <ConfirmProvider>
      <ToastProvider placement='top-left' autoDismiss components={{ Toast: CustomToast }}>
        <SettingsProvider>
          <ThemeProvider theme={createTheme({ palette: { mode: 'dark' }, typography: { fontFamily: 'Montaga' } })}>
            <div className="app">
              <GamePage />
            </div>
          </ThemeProvider>
        </SettingsProvider>
      </ToastProvider>
    </ConfirmProvider>
  );
};
