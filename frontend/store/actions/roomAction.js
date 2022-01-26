import types from "../types";
import { apiInstance } from "../../api/index";

const api = apiInstance();

//헤더 토큰 셋팅(임시)
function setAuthToken() {
  const accessToken =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imppc3VAc3NhZnkuY29tIiwiaWF0IjoxNjQzMTc1ODY5LCJleHAiOjE2NDMxNzU4NzF9.fNGUiECZFQUSgABj6J5a3EjBOLGz9GKo1YKVHgqR6fg";
  const refreshToken =
    "Refresh Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imppc3VAc3NhZnkuY29tIiwiaWF0IjoxNjQzMTc1ODY5LCJleHAiOjE2NDQwMzk4Njl9.Z1eu0O2KQ-rvryaIVtCdRfNZ1Yi0H-pFPoO55GozPSY";
  console.log("헤더 토큰 셋팅 성공");
}

//actions
//모든 스터디 조회(+ pagination)
export const fetchRooms = async (param) => {
  const response = await api.get("/study", {params: param});
  const rooms = response.data.response.content;
  console.log("rooms", rooms);
  return {
    type: types.GET_ROOMS,
    rooms,
  };
};

export const createRoom = (newRoom) => ({
  type: types.CREATE_ROOM,
  newRoom,
});
