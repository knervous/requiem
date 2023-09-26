import { createReducer, createAction } from '@reduxjs/toolkit';
import defaultState from '../defaultState';

export const actions = {
  setSpawnOnScreen: createAction('SET_SPAWN_ON_SCREEN', spawn => {
    return { payload: spawn };
  }),
  setSpawnOffScreen: createAction('SET_SPAWN_OFF_SCREEN', spawn_id => {
    return { payload: spawn_id };
  }),
};

export const reducer = createReducer(defaultState, builder => {
  builder.addCase(actions.setSpawnOnScreen, (state, action) => {
    state.ui.visibleSpawns[action.payload.id] = action.payload;
    return state;
  });

  builder.addCase(actions.setSpawnOffScreen, (state, action) => {
    delete state.ui.visibleSpawns[action.payload];
    return state;
  });
});
