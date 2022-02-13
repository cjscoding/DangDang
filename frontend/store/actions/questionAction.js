import types from "../types";

export const addQuestion = (field, question) => ({
  type: types.ADD_QUESTION,
  field,
  question,
});

export const removeQuestion = (idx) => ({
  type: types.REMOVE_QUESTION,
  idx,
});

export const setQuestions = (questions) => ({
  type: types.SET_QUESTIONS,
  questions,
});

export const setMyQuestions = (myQuestions) => ({
  type: types.SET_MY_QUESTIONS,
  myQuestions,
});
