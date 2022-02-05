import types from "../types";

export const setPosts = (posts) => {
  return {
    type: types.GET_STUDYPOST,
    posts,
  };
};
