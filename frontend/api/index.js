import axios from "axios";
import { BACKEND_URL } from "../config";

// axios 객체 생성
function apiInstance() {
  const instance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
      "Content-type": "application/json",
    },
    // validateStatus: (status) => {
    //   return status >= 200 && status < 300;
    // },
  });

  // 요청 인터셉터 추가
  instance.interceptors.request.use(
    // 요청을 보내기 전 수행해야 할 일
    (config) => {
      // 모든 요청에 헤더 토큰 추가
      const authorization = localStorage.getItem("authorization");
      const refreshtoken = localStorage.getItem("refreshtoken");
      if (authorization && refreshtoken) {
        config.headers.authorization = authorization;
        config.headers.refreshtoken = refreshtoken;
      }
      return config;
    },
    // 오류 요청을 보내기 전 수행해야 할 일
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 추가
  instance.interceptors.response.use(
    // 응답 데이터를 가공
    (response) => {
      // 응답 후 토큰 갱신
      const authorization = response.headers.authorization;
      const refreshtoken = response.headers.refreshtoken;
      localStorage.setItem("authorization", authorization);
      localStorage.setItem("refreshtoken", refreshtoken);
      console.log(`response ${response}`);
      return response;
    },
    // 오류 응답 처리
    (error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.respose.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(`Error ${error.message}`);
      }
      Promise.reject(error);
    }
  );
  return instance;
}

export { apiInstance };
