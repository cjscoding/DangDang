import types from "../types";

const initialState = {
  questions: [],
  myQuestions: [],
};

const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_QUESTION:
      return { ...state, questions: [...state.questions, action.question] };
    case types.SET_QUESTIONS:
      return { ...state, questions: action.questions };
    case types.SET_MY_QUESTIONS:
      return { ...state, myQuestions: action.myQuestions };
    default:
      return state;
  }
};

export default questionReducer;
