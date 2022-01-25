import { apiInstance } from "./index";

const api = apiInstance();

function getToken(loginParams, success, fail) {
  api.get(`/user/login`, { params: loginParams }).then(success).catch(fail);
}

function signUpRequest(params, success, fail) {
  api.post(`/user`, params).then(success).catch(fail);
}

export { getToken, signUpRequest };
