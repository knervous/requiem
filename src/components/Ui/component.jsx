
import React, { createContext, useContext } from 'react';

import { ZoneContext } from '../Zone/component';
import { Character } from './character/component';
import { Chat } from './chat/component';

import './component.scss';
import { Group } from './group/component';
import { Target } from './target';

const processMode =
  new URLSearchParams(window.location.search).get('mode') === 'process';

export const UiContext = createContext(null);

export const UiOverlay = ({ rootNode }) => {
  const { character } = useContext(ZoneContext);

  return processMode && character && rootNode ? (
    <UiContext.Provider value={{ rootNode }}>
      createPortal(
      <div className="ui-overlay">
        <Target />
        <Character />
        <Group />
        <Chat />
      </div>
      , rootNode)
    </UiContext.Provider>
  ) : null;
};

export default UiOverlay;
