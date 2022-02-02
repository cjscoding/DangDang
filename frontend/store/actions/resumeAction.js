import types from "../types";
// import { apiInstance } from "../../api/index";

import axios from "axios";
import { BACKEND_URL } from "../../config/index";
function apiInstance() {
  const instance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
      "Content-type": "application/json",
    },
    // validateStatus: (status) => {
    //   return status >= 200 && status < 300;
    // },
  });
  return instance;
}

const api = apiInstance();

//헤더 토큰 셋팅(임시)
const accessToken1 =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3RAc3NhZnkuY29tIiwiaWF0IjoxNjQzNzkzMTcxLCJleHAiOjE2NDM4Nzk1NzF9.lkdRHA61t9uPbKY6uku6kiumR02N_velU1NyaFnyWUo";
const accessToken2 =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QwQHNzYWZ5LmNvbSIsImlhdCI6MTY0MzY5MzM4MSwiZXhwIjoxNjQzNzc5NzgxfQ.ovrH47S-6gqvkQJ3XjsUIv4-AE_U6SalBvuRR2awvu4";
const accessToken5 =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QzQHNzYWZ5LmNvbSIsImlhdCI6MTY0MzczNjMxOSwiZXhwIjoxNjQzODIyNzE5fQ.2kxz2POsIfC4GT5BJW_KukOYt1XKpRvd77ZDrvKLbrw";
function setAuthToken() {
  api.defaults.headers.Authorization = accessToken1;
}

export const getResume = async (userId) => {
  setAuthToken();
  const response = await api.get(`/resume/${userId}`);
  const resArray = response.data.response;
  if (resArray.length > 0) {
    return {
      type: types.GET_RESUME,
      curMemberResume: resArray[0].resumeQuestionList,
    };
  } else {
    return {
      type: types.NO_RESUME,
      curMemberResume: [],
    };
  }
};
