import types from "../types";

export const connectSocket = (ws) => (
  {
    type: types.CONNECT_SOCKET,
    ws,
  }
);

export const setWSSessionId = (sessionId) => (
  {
    type: types.SET_WEB_SOCKET_SESSION_ID,
    sessionId,
  }
);

export const pushRecordedQuestionIdx = (idx) => (
  {
    type: types.PUSH_RECORDED_QUESTION_IDX,
    idx,
  }
);