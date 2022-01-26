import types from "../types";
import axios from "axios";
// import { getAllRooms } from "../../api/room";

export const createRoom = (newRoom) => ({
  type: types.CREATE_ROOM,
  newRoom,
});

export const createComment = (newComment) => ({
  type: types.CREATE_COMMENT,
  newComment,
});

// async function getAllRooms(success, fail) {
//   return await api.get(`/study`).then((res)=>console.log(res);).catch(fail);
// }
export const fetchRooms = async () => {
    const response = await axios.get('http://localhost:8080/study');
    const rooms = response.data.response.content;
    console.log("rooms", rooms);
    return {
        type: types.GET_ROOMS,
        rooms,
    }
};
