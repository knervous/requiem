import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfirmProvider } from 'material-ui-confirm';

import { Main } from './components/Main';
import { GlobalStoreProvider } from './state';

import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <GlobalStoreProvider>
    <ConfirmProvider>
      <Main />
    </ConfirmProvider>
  </GlobalStoreProvider>
);
