
import React, { createContext, useContext } from 'react';

import { Character } from './character/component';
import { Chat } from './chat/component';

import './component.scss';
import { Group } from './group/component';
import { Macros } from './macros';
import { Target } from './target';

const processMode =
  new URLSearchParams(window.location.search).get('mode') === 'process';
const embedded = new URLSearchParams(window.location.search).get('embedded') === 'true';
export const UiContext = createContext(null);
export const useUiContext = () => useContext(UiContext);
export const UiOverlay = ({ rootNode, character }) => {
  return processMode && character && rootNode ? (
    <UiContext.Provider value={{ rootNode, embedded }}>
      createPortal(
      <div className="ui-overlay">
        <Target rootNode={rootNode}/>
        {!embedded && <Character rootNode={rootNode}/>}
        <Group rootNode={rootNode}/>
        {!embedded && <Chat rootNode={rootNode}/>}
        <Macros rootNode={rootNode}/>
      </div>
      , rootNode)
    </UiContext.Provider>
  ) : null;
};

export default UiOverlay;
