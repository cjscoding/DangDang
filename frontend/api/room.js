import { apiInstance } from "./index";

const api = apiInstance();

//헤더 토큰 셋팅
function setAuthToken() {
  const accessToken =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imppc3VAZGFuZ2RhbmcuY29tIiwiaWF0IjoxNjQzMTEzOTQ2LCJleHAiOjE2NDMxMTM5NDh9.BDXTQ3fPrDDMMtjsHam7WN1UpmHFA8Ezoeo28t1xUbc";
  const refreshToken =
    "Refresh Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imppc3VAZGFuZ2RhbmcuY29tIiwiaWF0IjoxNjQzMTEzOTQ2LCJleHAiOjE2NDM5Nzc5NDZ9.-SdVuMdTgFkbYzOlNwqsZ6r_YAQCFSoygshUYYC-IgY";
  console.log("헤더 토큰 셋팅 성공");
}

//모든 스터디룸 조회
async function getAllRooms(success, fail) {
  await api.get(`/study`).then(success).catch(fail);
}

//새로운 스터디룸 생성
function createRoom(roomInfo, success, fail) {
  console.log(roomInfo);
  setAuthToken();
  api.post(`/study`, JSON.stringify(roomInfo)).then(success).catch(fail);
}

//유저가 속한 스터디룸만 조회
function getUserRooms(articleno, success, fail) {
  setAuthToken();
  api.get(``).then(success).catch(fail);
}

//기존 스터디룸 수정
function modifyRoom(roomInfo, success, fail) {
  setAuthToken();
  api.patch(`/study`, JSON.stringify(roomInfo)).then(success).catch(fail);
}

//기존 스터디룸 삭제
function deleteRoom(studyId, success, fail) {
  setAuthToken();
  api.delete(`/study/${studyId}`).then(success).catch(fail);
}

export { getAllRooms, createRoom, getUserRooms, modifyRoom, deleteRoom };
