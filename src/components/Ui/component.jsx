
import React, { createContext, useContext } from 'react';

import { ZoneContext } from '../Zone/component';
import { Character } from './character/component';
import { Chat } from './chat/component';

import './component.scss';
import { Group } from './group/component';
import { Macros } from './macros';
import { Target } from './target';

const processMode =
  new URLSearchParams(window.location.search).get('mode') === 'process';

export const UiContext = createContext(null);

export const UiOverlay = ({ rootNode, character }) => {
  return processMode && character && rootNode ? (
    <UiContext.Provider value={{ rootNode }}>
      createPortal(
      <div className="ui-overlay">
        <Target rootNode={rootNode}/>
        <Character rootNode={rootNode}/>
        <Group rootNode={rootNode}/>
        <Chat rootNode={rootNode}/>
        <Macros rootNode={rootNode}/>
      </div>
      , rootNode)
    </UiContext.Provider>
  ) : null;
};

export default UiOverlay;
