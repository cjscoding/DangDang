import { apiInstance } from "./index";

const api = apiInstance();

//팀스페이스 게시판 create
export const addPost = async (data, success, fail) => {
  await api
    .post(`/study/${data.studyId}/post`, data.req)
    .then(success)
    .catch(fail);
};
//팀스페이스 게시판 read
export const getPosts = async (params, success, fail) => {
  await api
    .get(`/study/${params.studyId}/post`, { params: params.param })
    .then(success)
    .catch(fail);
};
//팀스페이스 게시판 update
export const updatePost = async (data, success, fail) => {
  await api
    .patch(`/study/${data.studyId}/post/${data.postId}`, data.req)
    .then(success)
    .catch(fail);
};
//팀스페이스 게시판 delete
export const deletePost = async (data, success, fail) => {
  await api
    .delete(`/study/${data.studyId}/post/${data.postId}`)
    .then(success)
    .catch(fail);
};
