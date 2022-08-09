import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Main } from './components/Main';

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
