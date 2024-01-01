import React, { useEffect, useMemo } from 'react';

import { GAME_STATES, GameState, UiState, useSelector } from '../../state';
import { Login } from '../Login/component';
import { Zone } from '../Zone/component';
import { CharSelect } from '../CharacterSelect';

// scss
import './component.scss';
import { Splash } from '../Common/splash';
import { Typography } from '@mui/material';
import { useToasts } from 'react-toast-notifications';
import { gameController } from '../Babylon/controllers/GameController';

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

export const GamePage = () => {
  const gameState = useSelector(GameState.state);
  const loading = useSelector(UiState.loading);
  const loadingText = useSelector(UiState.loadingText);
  const exploreMode = useSelector(GameState.exploreMode);
  const { addToast } = useToasts();

  useEffect(() => {
    gameController.addToast = addToast;
  }, [addToast]);

  const content = useMemo(() => {
    if (params.zone?.length || exploreMode) {
      return <Zone />;
    }

    switch (gameState) {
      case GAME_STATES.IN_ZONE:
        return <Zone />;
      case GAME_STATES.CHAR_SELECT:
        return <CharSelect />;
      case GAME_STATES.LOGIN:
        return <Login />;
      default:
        return <Login />;
    }
  }, [gameState, exploreMode]);

  return <>{loading && <Splash><div className="loading-box">
    <Typography sx={{ fontSize: 20, padding: 0, margin: 0 }} gutterBottom>
      {loadingText}
    </Typography>
  </div></Splash>}{content}</>;
};
