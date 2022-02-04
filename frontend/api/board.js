import { apiInstance } from "./index";

const api = apiInstance();

//팀스페이스 게시판 create
//팀스페이스 게시판 read
export const getPosts = async (params, success, fail) => {
  await api
    .get(`/study/${params.studyId}/post`, { params: params.param })
    .then(success)
    .catch(fail);
};
//팀스페이스 게시판 update
//팀스페이스 게시판 delete