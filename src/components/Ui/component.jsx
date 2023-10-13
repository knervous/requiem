
import React, { createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Chat } from './chat/component';
import { Target } from './target/component';
import { Character } from './character/component';
import { Group } from './group/component';

import './component.scss';


export const UiContext = createContext(null);
export const useUiContext = () => useContext(UiContext);
export const UiOverlay = ({ rootNode }) => {
  return rootNode ? (
    <UiContext.Provider value={{ rootNode }}>
      {createPortal(
        <div className="ui-overlay">
          <Target rootNode={rootNode}/>
          <Character rootNode={rootNode}/>
          <Group rootNode={rootNode}/>
          <Chat rootNode={rootNode}/>
        </div>
        , rootNode)}
    </UiContext.Provider>
  ) : 'nada';
};

export default UiOverlay;
