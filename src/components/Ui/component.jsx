
import React, { createContext, useContext } from 'react';

// import { Character } from './character/component';
import { Chat } from './chat/component';

import './component.scss';


export const UiContext = createContext(null);
export const useUiContext = () => useContext(UiContext);
export const UiOverlay = ({ rootNode }) => {
  return rootNode ? (
    <UiContext.Provider value={{ rootNode }}>
      createPortal(
      <div className="ui-overlay">
        {/* <Target rootNode={rootNode}/>
        <Character rootNode={rootNode}/>
        <Group rootNode={rootNode}/> */}
        <Chat rootNode={rootNode}/>
      </div>
      , rootNode)
    </UiContext.Provider>
  ) : null;
};

export default UiOverlay;
