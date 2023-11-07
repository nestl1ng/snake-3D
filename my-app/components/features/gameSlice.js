import { createSlice } from "@reduxjs/toolkit";

const states = {
  loadingManifest: {
    avaliableStates: ["loadingAssets"],
    nextState: "loadingAssets",
  },
  loadingAssets: {
    avaliableStates: ["initialization"],
    nextState: "initialization",
  },
  initialization: {
    avaliableStates: ["initLevel"],
    nextState: "initLevel",
  },
  initLevel: {
    avaliableStates: ["playing"],
    nextState: "playing",
  },
  playing: {
    avaliableStates: null,
    nextState: null,
  },
};

export const gameSlice = createSlice({
  name: "initGame",
  initialState: {
    gameState: "loadingManifest",
  },
  reducers: {
    nextStep(state) {
      if (!states[state.gameState].nextState) return;
      state.gameState = states[state.gameState].nextState;
    },
  },
});

export const { nextStep } = gameSlice.actions;

export default gameSlice.reducer;