import types from "../types";

export const setQuestionList = (questions) => {
  return {
    type: types.GET_QUESTIONS,
    questions,
  };
};

export const setUserList = (users) => {
  return {
    type: types.GET_USERS,
    users,
  };
};
