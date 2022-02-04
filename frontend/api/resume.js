import { apiInstance } from "./index";

const api = apiInstance();

//자소서 create
export const createResume = async (req, success, fail) => {
    await api.post("/resume", req).then(success).catch(fail);
}

//자소서 read
export const getResume = async (userId, success, fail) => {
  await api.get(`/resume/${userId}`).then(success).catch(fail);
};

//자소서 update
export const updateResume = async (data, success, fail) => {
    await api.patch(`/resume/${data.resumeId}`, data.req).then(success).catch(fail);
}
//자소서 delete
