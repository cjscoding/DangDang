import types from "../types";

const boardState = {
  posts: [],
};

const boardReducer = (state = boardState, action) => {
  switch (action.type) {
    case types.GET_STUDYPOST:
      const posts = action.posts;
      return { ...state, posts };

    default:
      return state;
  }
};

export default boardReducer;