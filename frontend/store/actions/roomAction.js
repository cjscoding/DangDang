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
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3RAc3NhZnkuY29tIiwiaWF0IjoxNjQzNzI2ODUyLCJleHAiOjE2NDM4MTMyNTJ9.EVTU6m3qTe1jNJjNs2vxX5J1-xm0AhHu5-PKTPB2giM";
const accessToken2 =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QwQHNzYWZ5LmNvbSIsImlhdCI6MTY0MzY5MzM4MSwiZXhwIjoxNjQzNzc5NzgxfQ.ovrH47S-6gqvkQJ3XjsUIv4-AE_U6SalBvuRR2awvu4";
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
  const host = roomInfo.host.nickName;
  const members = roomInfo.userDtos;
  return {
    type: types.GET_ROOM_INFO,
    roomInfo,
    host,
    members,
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

//스터디룸 삭제
export const removeStudy = async (studyId) => {
  setAuthToken();
  await api.delete(`/study/${studyId}`);
};

//스터디룸 수정
export const updateStudy = async (data) => {
  //   setAuthToken();

  await axios.patch(
    `http://localhost:8080/study/${data.studyId}`,
    data.newInfo,
    {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3RAc3NhZnkuY29tIiwiaWF0IjoxNjQzNzI2ODUyLCJleHAiOjE2NDM4MTMyNTJ9.EVTU6m3qTe1jNJjNs2vxX5J1-xm0AhHu5-PKTPB2giM",
      },
    }
  );
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

//스터디룸 가입 대기 명단 조회
export const getWaitingMembers = async (studyId) => {
  setAuthToken();
  const response = await api.get(`/joins/waiting/${studyId}`);
  const waitings = response.data.response;
  return {
      type: types.WAITING_MEMBERS,
      waitings,
    };
};

//스터디룸 가입 허용
export const allowJoinTeam = async (data) => {
    setAuthToken();
    await api.patch("/joins", data);
    console.log("가입을 허용하였습니다.");
}

//스터디룸 팀원 강제 탈퇴
export const removeMember = async (data) => {
    setAuthToken();
    await api.delete(`/joins/${data.studyId}/${data.userId}`);
    console.log("강제 탈퇴 완료");
}