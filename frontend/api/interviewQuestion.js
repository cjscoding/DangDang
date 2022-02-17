import { apiInstance } from "./index";

const api = apiInstance();

export function getInterviewQuestions(params, success, fail) {
  api.get(`/interview/search`, {params}).then(success).catch(fail);
}
export function getMyInterviewQuestions(params, success, fail) {
  api.get(`/interview/mine`, {params}).then(success).catch(fail);
}
export function getMyBookmarkQuestions(params, success, fail) {
  api.get(`/interview/bookmark`, {params}).then(success).catch(fail);
}
export function getRecommendedQuestions(params, success, fail) {
  api.get(`/interview/recommend`, {params}).then(success).catch(fail);
}
export function addInterviewQuestion(params, success, fail) {
  api.post(`/interview`, params).then(success).catch(fail);
}

export function updateInterviewQuestion(params, success, fail) {
  api.patch(`/interview/${params.interviewQuestionId}`, params.req).then(success).catch(fail);
}

export function deleteInterviewQuestion(interviewQuestionId, success, fail) {
  api.delete(`/interview/${interviewQuestionId}`).then(success).catch(fail);
}
