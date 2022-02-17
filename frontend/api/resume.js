import { apiInstance } from "./index";

const api = apiInstance();

//자소서 create
export const createResume = async (data, success, fail) => {
  await api.post(`/resume/${data.studyId}`, data.req).then(success).catch(fail);
};

//자소서 read
export const getResume = async (data, success, fail) => {
  await api.get(`/resume/${data.studyId}/${data.userId}`).then(success).catch(fail);
};

export const getStudyResume = async ({userId, studyId}, success, fail) => {
  await api.get(`/resume/${studyId}/${userId}`).then(success).catch(fail);
};

//자소서 update
export const updateResume = async (data, success, fail) => {
  await api
    .patch(`/resume/${data.studyId}/${data.resumeId}`, data.req)
    .then(success)
    .catch(fail);
};

//자소서 delete
export const deleteResume = async (data, success, fail) => {
  await api.delete(`/resume/${data.studyId}/${data.resumeId}`).then(success).catch(fail);
};

//자소서 댓글, 대댓글 create
export const createResumeComment = async (data, success, fail) => {
  await api
    .post(`/resume/${data.resumeId}/comment`, data.obj)
    .then(success)
    .catch(fail);
};

//자소서 댓글, 대댓글 update
export const updateResumeComment = async (data, success, fail) => {
  await api
    .patch(`/resume/${data.resumeId}/comment/${data.commentId}`, data.obj)
    .then(success)
    .catch(fail);
};

//자소서 댓글, 대댓글 delete
export const deleteResumeComment = async (data, success, fail) => {
  await api
    .delete(`/resume/${data.resumeId}/comment/${data.commentId}`)
    .then(success)
    .catch(fail);
};
