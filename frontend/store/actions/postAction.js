import * as types from "../types";

export const fetchposts = () => async (dispatch) => {
    
  dispatch({
    type: types.GET_POSTS,
    payload: ["1st post", "2nd posts", "3rd posts"],
    host: ["sid", "syd", "cjs"],
    teamNo: ["123", "Wer"],
  });
};

export const fetchrooms = () => async (dispatch) => {
  dispatch({
    type: types.GET_ROOMS,
    keywords: [
      ["fe", "ghkf", "sdf"],
      ["be", "rew"],
      ["뇸뇸", "냥냥", "모여~~"],
      ["하하", "호호"],
    ],
  });
};

export const fetchmyrooms = () => async (dispatch) => {
  dispatch({
    type: types.GET_MY_ROOMS,
    keywords: [
      ["내", "방", "이", "야"],
      ["아", "마"],
      ["엑", "시", "오", "스"],
      ["쓰", "려", "나", "?"],
      ["그림은", "임시"],
    ],
  });
};

export const fetchteamno = () => async (dispatch) => {
  function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
  }
  let no = searchParam(no);
  console.log(no);

  dispatch({
    type: types.SET_TEAM_NO,
    teamNo: no,
  });
};
