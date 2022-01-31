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
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3RAc3NhZnkuY29tIiwiaWF0IjoxNjQzNjE4NjcwLCJleHAiOjE2NDM3MDUwNzB9.Wd-n1B6JZ9Y-qe5BWeBkML8Bec1IsrBzAd4Nm0uDABo";
const accessToken2 =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QwQHNzYWZ5LmNvbSIsImlhdCI6MTY0MzYwNjU0NiwiZXhwIjoxNjQzNjkyOTQ2fQ.J_mjCJIH1i5E-zsdfL477oVZ2mnLHCQhjPbrH0JWIcg";
function setAuthToken() {
  api.defaults.headers.Authorization = accessToken1;
}

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

//스터디 단일 조회
export const fetchRoomInfo = async (studyId) => {
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
  await api.post("/study", newRoom);
};

//스터디룸 가입 신청
export const joinStudy = async (data) => {
  setAuthToken();
  await api.post("/joins", data);
};

//마이룸 조회
export const getMyRooms = async (param) => {
  setAuthToken();
  const response = await api.get("/joins", { params: param });
  const myRooms = response.data.response.content;
  const myRoomsCount = response.data.response.totalElements;
  return {
    type: types.MY_ROOMS,
    myRooms,
    myRoomsCount,
  };
};
