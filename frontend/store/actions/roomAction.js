import types from "../types";

export const createRoom = (newRoom) => ({
  type: types.CREATE_ROOM,
  newRoom,
});

export const createComment = (newComment) => ({
  type: types.CREATE_COMMENT,
  newComment,
});
