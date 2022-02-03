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
