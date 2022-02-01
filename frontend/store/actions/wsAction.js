import types from "../types";

export const connectSocket = (ws) => (
  {
    type: types.CONNECT_SOCKET,
    ws,
  }
);