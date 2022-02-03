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

//모든 스터디 조회(+ pagination)
export const setAllRooms = (roomList) => ({
  type: types.GET_ROOMS,
  rooms: roomList.rooms,
  roomsCount: roomList.roomsCount,
});

//마이룸 조회
export const setMyRooms = (myRoomList) => ({
  type: types.MY_ROOMS,
  myRooms: myRoomList.myRooms,
  myRoomsCount: myRoomList.myRoomsCount,
});

//스터디룸 단일 조회
export const setRoomInfo = (roomData) => ({
  type: types.GET_ROOM_INFO,
  roomInfo: roomData.roomInfo,
  host: roomData.host,
  members: roomData.members,
  comments: roomData.comments,
});

//스터디룸 가입 신청
export const joinStudy = async (data) => {
  setAuthToken();
  await api.post("/joins", data);
};

//스터디룸 가입 대기 명단 조회
export const setWaitings = (waitings) => ({
  type: types.WAITING_MEMBERS,
  waitings,
});

//스터디룸 가입 허용
export const allowJoinTeam = async (data) => {
  setAuthToken();
  await api.patch("/joins", data);
  console.log("가입을 허용하였습니다.");
};

//스터디룸 상세 공고 댓글, 대댓글 Post
export const createDetailComment = async (data) => {
  setAuthToken();
  await api.post(`/study/${data.studyId}/comment`, data.obj);
  console.log("등록되었습니다.");
};

//스터디룸 상세 공고 댓글, 대댓글 Update
export const updateDetailComment = async (data) => {
  setAuthToken();
  await api.patch(`/study/{studyId}/comment/${data.commentId}`, data.obj);
  console.log("수정되었습니다.");
};

//스터디룸 상세 공고 댓글, 대댓글 Delete
export const deleteDetailComment = async (data) => {
  setAuthToken();
  await api.delete(`/study/{studyId}/comment/${data.commentId}`);
  console.log("삭제되었습니다.");
};
