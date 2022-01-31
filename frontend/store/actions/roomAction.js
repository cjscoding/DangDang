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

const accessToken =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QwQHNzYWZ5LmNvbSIsImlhdCI6MTY0MzYwNjU0NiwiZXhwIjoxNjQzNjkyOTQ2fQ.J_mjCJIH1i5E-zsdfL477oVZ2mnLHCQhjPbrH0JWIcg";
//헤더 토큰 셋팅(임시)
function setAuthToken() {
  //   const refreshToken =
  //     "Refresh Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QwQHNzYWZ5LmNvbSIsImlhdCI6MTY0MzYwNjU0NiwiZXhwIjoxNjQzNjU2NjExfQ.Ng4LqpRXX4C6in7MvW2vt0IIURoi4G3wBpRAmUya_6Y";
  api.defaults.headers.Authorization = accessToken;
  console.log("헤더 토큰 셋팅 성공");
}

//actions
//모든 스터디 조회(+ pagination)
export const fetchRooms = async (param) => {
  const response = await api.get("/study", { params: param });
  const rooms = response.data.response.content;
  const roomsCount = response.data.response.totalElements;
  return {
    type: types.GET_ROOMS,
    rooms,
    roomsCount,
  };
};

//현재 스터디 공고 상세정보 조회
export const fetchRoomInfo = async (studyId) => {
  console.log("action!!");
  const response = await api.get(`/study/${studyId}`);
  const roomInfo = response.data.response;
  return {
    type: types.GET_ROOM_INFO,
    roomInfo,
  };
};

//새로운 스터디룸 생성
export const createRoom = async (newRoom) => {
  setAuthToken();
  console.log("create new room!!");
  await api.post("/study", newRoom);
};
