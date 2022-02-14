import { apiInstance } from "./index";

const api = apiInstance();

//관리자 모든 질문 조회
export const getAllQuestionList = async (param, success, fail) => {
  await api
    .get(`/admin/interview`, { params: param })
    .then(success)
    .catch(fail);
};

//질문 공개
export const setQuestionOpen = async (interviewId, success, fail) => {
  await api
    .patch(`/admin/interview/${interviewId}/makePublic`)
    .then(success)
    .catch(fail);
};

//질문 비공개
export const setQuestionPrivate = async (interviewId, success, fail) => {
  await api
    .patch(`/admin/interview/${interviewId}/hide`)
    .then(success)
    .catch(fail);
};

//관리자 모든 회원 조회
export const getAllUserList = async (param, success, fail) => {
  await api.get(`/admin/user`, { params: param }).then(success).catch(fail);
};

//유저 권한 부여
export const setUserAsManager = async (userId, success, fail) => {
  await api.patch(`/admin/user/${userId}`).then(success).catch(fail);
};
