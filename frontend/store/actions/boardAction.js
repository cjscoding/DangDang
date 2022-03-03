//팀스페이스 내 게시판
import types from "../types";

export const setPosts = (posts) => {
  return {
    type: types.GET_STUDYPOST,
    posts,
  };
};
