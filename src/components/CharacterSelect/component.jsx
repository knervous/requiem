import React, { useEffect, useRef, useState } from 'react';
import { GameState, useSelector } from '../../state';
import { gameController } from '../Babylon/controllers/GameController';
import { VIEWS } from './constants';
import { CharacterSelect } from './char-select';
import { CharacterCreate } from './char-create';

import './component.scss';

export const CharSelect = () => {
  const loginInfo = useSelector(GameState.loginState);
  const [view, setView] = useState(VIEWS.CHAR_SELECT);
  const [, forceRender] = useState({});
  const [babylonLoaded, setBabylonLoaded] = useState(false);

  const canvasRef = useRef();
  const zoneRef = useRef();

  useEffect(() => {
    (async () => {
      await gameController.loadEngine(canvasRef.current);
      gameController.loadCharacterSelect().then(() => {
        window.addEventListener('resize', gameController.resize);
        window.addEventListener('keydown', gameController.keyDown);
        forceRender({});
        setBabylonLoaded(true);
      });
    })();

    return () => {
      window.removeEventListener('resize', gameController.resize);
      window.addEventListener('keydown', gameController.keyDown);
    };
  }, []);

  return (
    <div ref={zoneRef} width="100%" height="100%">
      {babylonLoaded && (
        <div className="char-select">
          <img
            src="/brand/png/logo-no-background-white.png"
            width={300}
            alt="logo"
          />
          {view === VIEWS.CHAR_SELECT && (
            <CharacterSelect
              babylonLoaded={babylonLoaded}
              loginInfo={loginInfo}
              setView={setView}
            />
          )}
          {view === VIEWS.CHAR_CREATE && (
            <CharacterCreate
              babylonLoaded={babylonLoaded}
              loginInfo={loginInfo}
              setView={setView}
            />
          )}
        </div>
      )}

      <canvas width="100vw" height="100vh" ref={canvasRef} id="renderCanvas" />
    </div>
  );
};
