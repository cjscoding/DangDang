import types from "../types";

const adminState = {
  questions: [],
  users: [],
};

const adminReducer = (state = adminState, action) => {
  switch (action.type) {
    case types.GET_QUESTIONS:
      const questions = action.questions;
      return { ...state, questions };

    case types.GET_USERS:
      const users = action.users;
      return { ...state, users };

    default:
      return state;
  }
};

export default adminReducer;
