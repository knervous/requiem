import { createReducer, createAction } from '@reduxjs/toolkit';
import defaultState from '../defaultState';

export const actions = {
  setGameState: createAction('SET_GAMESTATE', gameState => {
    return { payload: gameState };
  }),
  setCharacter: createAction('SET_CHARACTER', character => {
    return { payload: character };
  }),
  setExploreMode: createAction('SET_EXPLORE', () => {
    return { };
  }),
  setIp: createAction('SET_IP', ip => {
    return { payload: ip };
  }),
};

export const reducer = createReducer(defaultState, builder => {
  builder.addCase(actions.setGameState, (state, action) => {
    state.gameState = action.payload;
    return state;
  });

  builder.addCase(actions.setCharacter, (state, action) => {
    state.character = action.payload;
    return state;
  });

  builder.addCase(actions.setExploreMode, (state) => {
    state.exploreMode = true;
    return state;
  });

  builder.addCase(actions.setIp, (state, action) => {
    state.ip = action.payload;
    return state;
  });
});
