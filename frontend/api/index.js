import axios from "axios";
import { BACKEND_URL } from "../config";

// axios 객체 생성
function apiInstance() {
  const instance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
      "Content-type": "application/json",
    },
  });
  return instance;
}

export { apiInstance };
