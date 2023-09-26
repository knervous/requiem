import React from 'react';
import { createRoot } from 'react-dom/client';
import { Main } from './components/Main';
import { GlobalStoreProvider } from './state';

import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <GlobalStoreProvider>
    <Main />
  </GlobalStoreProvider>
);
