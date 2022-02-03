import { apiInstance } from "./index";

const api = apiInstance();

//자소서 create

//자소서 read
export const getResume = async (userId, success, fail) => {
  await api.get(`/resume/${userId}`).then(success).catch(fail);
};

//자소서 update
//자소서 delete
