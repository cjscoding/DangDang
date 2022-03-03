import { apiInstance } from "./index";

const api = apiInstance();

//모든 스터디 조회(+ pagination)
export const getAllRooms = async (param, success, fail) => {
  await api.get("/study", { params: param }).then(success).catch(fail);
};

//마이룸 조회
export const getMyRooms = async (param, success, fail) => {
  await api.get("/joins", { params: param }).then(success).catch(fail);
};

//스터디 단일 조회
export const getRoomInfo = async (studyId, success, fail) => {
  await api.get(`/study/${studyId}`).then(success).catch(fail);
};

//스터디 생성
export const createRoom = async (newRoom, success, fail) => {
  await api.post("/study", newRoom).then(success).catch(fail);
};

//스터디룸 삭제
export const removeRoom = async (studyId, success, fail) => {
  await api.delete(`/study/${studyId}`).then(success).catch(fail);
};

//스터디룸 수정
export const updateRoom = async (data, success, fail) => {
  await api
    .patch(`/study/${data.studyId}`, data.newInfo)
    .then(success)
    .catch(fail);
};

//스터디 이미지 등록
export const addRoomImg = async (data, success, fail) => {
  const formData = new FormData();
  formData.append("image", data.image);
  await api
    .post(`/study/${data.studyId}/image`, formData)
    .then(success)
    .catch(fail);
};

//스터디 이미지 수정
export const updateRoomImg = async (data, success, fail) => {
  const formData = new FormData();
  formData.append("image", data.newImage);
  await api
    .patch(`/study/${data.studyId}/image`, formData)
    .then(success)
    .catch(fail);
};
