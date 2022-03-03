import { apiInstance } from "./index";

const api = apiInstance();

//스터디룸 팀원 강제 탈퇴(호스트 권한)
export const removeMember = async (data, success, fail) => {
  await api
    .delete(`/joins/${data.studyId}/${data.userId}`)
    .then(success)
    .catch(fail);
};

//스터디룸 탈퇴(멤버 권한)
export const leaveTeam = async (studyId, success, fail) => {
  await api.delete(`/joins/${studyId}`).then(success).catch(fail);
};

//스터디룸 가입 대기 명단 조회
export const getWaitings = async (studyId, success, fail) => {
  await api.get(`/joins/waiting/${studyId}`).then(success).catch(fail);
};

//스터디룸 가입 신청, 신청 취소
export const joinTeam = async (data, success, fail) => {
  await api.post("/joins", data).then(success).catch(fail);
};

//스터디룸 가입 허용
export const allowMember = async (data, success, fail) => {
  await api.patch("/joins", data).then(success).catch(fail);
};

//스터디 가입 신청 여부 확인
export const checkJoin = async (studyId, success, fail) => {
  await api.get(`/joins/${studyId}`).then(success).catch(fail);
};
