import { apiInstance } from "./index";

const api = apiInstance();

function signUpRequest(params, success, fail) {
  api.post(`/user`, params).then(success).catch(fail);
}

function getToken(params, success, fail) {
  api.post(`/user/login`, params).then(success).catch(fail);
}

function getUserInfo(success, fail) {
  api.get(`/user/me`).then(success).catch(fail);
}

export { signUpRequest, getToken, getUserInfo };
