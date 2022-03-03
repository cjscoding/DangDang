import types from "../types";

const initialState = {
  ws: null,
  sessionId: null,
  recordedQuestionIdxes: [],
  selectedQuestion: null,
  screenWs: null,
};

const wsReducer = (state=initialState, action) => {
  switch (action.type) {
    case types.CONNECT_SOCKET:
      return {...state, ws: action.ws};
    case types.SET_WEB_SOCKET_SESSION_ID:
      return {...state, sessionId: action.sessionId};
    case types.PUSH_RECORDED_QUESTION_IDX:
      const recordedQuestionIdxes = [...state.recordedQuestionIdxes, action.idx]
      return {...state, recordedQuestionIdxes};
    case types.SET_SELECTED_QUESTION:
      return {...state, selectedQuestion: action.selectedQuestion};
    default:
      return state;
  }
}

export default wsReducer;