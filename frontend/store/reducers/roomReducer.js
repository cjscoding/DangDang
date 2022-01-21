import types from "../types";

const initialRoomState = {
  rooms: [],
  comments:[],
};

const roomReducer = (state = initialRoomState, action) => {
  switch (action.type) {
    case types.CREATE_ROOM:
      const rooms = [...state.rooms, action.newRoom];
      return {...state, rooms};
    case types.CREATE_COMMENT:
      const comments = [...state.comments, action.newComment];
      return {...state, comments};
    default:
      return state;
  }
};

export default roomReducer;
