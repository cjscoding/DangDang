import types from "../types";

export const createRoom = (newRoom) => ({
  type: types.CREATE_ROOM,
  newRoom,
});
