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

function logoutRequest(success, fail) {
  api.post(`/user/logout`).then(success).catch(fail);
}

/** Social Login */
function googleLoginRequest(success, fail) {
  api
    .get(
      `/oauth2/authorize/google?redirect_uri=http://localhost:3000/user/oauth2/redirect`
    )
    .then(success)
    .catch(fail);
}

export {
  signUpRequest,
  getToken,
  getUserInfo,
  logoutRequest,
  googleLoginRequest,
};
