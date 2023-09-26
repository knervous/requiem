import { createContext, useContext } from 'react';

export const BabylonContext = createContext({ });
export const useBablyonContext = () => useContext(BabylonContext);