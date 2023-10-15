export const GameState = {
  state     : store => store.gameState,
  loginState: store => store.loginState,
};

export const ZoneState = {
  zoneInfo : store => store.zoneInfo,
  character: store => store.character,
  zonePort : store => store.zonePort
};

export const Zone = {
  spawns: store => store.zone.spawns,
};

export const UiState = {
  visibleSpawns: store => store.ui.visibleSpawns,
  loading      : store => store.ui.loading,
  loadingText  : store => store.ui.loadingText,
};

export const ChatState = {
  lines: store => store.chat.chatLines
};