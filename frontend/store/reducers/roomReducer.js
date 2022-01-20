import types from "../types";

const initialRoomState = {
  rooms:[],
  doors:[],
};

const roomReducer = (state=initialRoomState, action) => {
  switch (action.type) {
    case types.CREATE_ROOM:
      const rooms = [...state.rooms, action.newRoom]
      return {...state, rooms};
    default:
      return state;
  }
}

export default roomReducer;
