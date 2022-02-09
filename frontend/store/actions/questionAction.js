import types from "../types";

export const addQuestion = (question) => ({
  type: types.ADD_QUESTION,
  question,
});

export const setQuestions = (questions) => ({
  type: types.SET_QUESTIONS,
  questions,
});

export const setMyQuestions = (myQuestions) => ({
  type: types.SET_MY_QUESTIONS,
  myQuestions,
});
