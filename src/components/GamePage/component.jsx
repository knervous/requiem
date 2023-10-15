import React, { useMemo } from 'react';

import { GAME_STATES, GameState, UiState, useSelector } from '../../state';
import { Login } from '../Login/component';
import { Zone } from '../Zone/component';
import { CharSelect } from '../CharacterSelect';

// scss
import './component.scss';
import { Splash } from '../Common/splash';
import { Typography } from '@mui/material';

export const GamePage = () => {
  const gameState = useSelector(GameState.state);
  const loading = useSelector(UiState.loading);
  const loadingText = useSelector(UiState.loadingText);
  const content = useMemo(() => {
    return <Zone />;
    switch (gameState) {
      case GAME_STATES.IN_ZONE:
        return <Zone />;
      case GAME_STATES.CHAR_SELECT:
        return <CharSelect />;
      case GAME_STATES.LOGIN:
      default:
        return <Login />;
    }
  }, [gameState]);

  return <>{loading && <Splash><div className="loading-box">
    <Typography sx={{ fontSize: 20, padding: 0, margin: 0 }} gutterBottom>
      {loadingText}
    </Typography>
  </div></Splash>}{content}</>;
};
