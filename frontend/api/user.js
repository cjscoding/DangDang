import { apiInstance } from "./index";

const api = apiInstance();

function getToken(params, success, fail) {
  api.post(`/user/login`, params).then(success).catch(fail);
}

function signUpRequest(params, success, fail) {
  api.post(`/user`, params).then(success).catch(fail);
}

export { getToken, signUpRequest };
