import { useRef } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { ConfirmProvider } from 'material-ui-confirm';

import { LeftDrawer } from '../LeftDrawer';
import {
  DefaultToast,
  ToastProvider,
  
} from 'react-toast-notifications';
import './component.scss';
import { SettingsProvider } from '../Context/settings';
import { MacroProvider } from '../Context/macroContext';


// Testing

// Wrapper for default toast to provide updates on hover
const CustomToast = ({ children, ...props }) => {
  const myToast = useRef(null);
  // Since we have no entrypoint to hook or extend the component from this library that controls the actual
  // timer mechanism for dismissal (ToastController) we can hack its react internal instance. This needs retested
  // anytime we upgrade React.
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
      <ToastProvider autoDismiss components={{ Toast: CustomToast }}>
        <MacroProvider>
          <SettingsProvider>
            <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
              <div className="app">
                <LeftDrawer />
              </div>
            </ThemeProvider>
          </SettingsProvider>
        </MacroProvider>
      </ToastProvider>
    </ConfirmProvider>
  );
};
