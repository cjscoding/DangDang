import types from "../types";

const initialRoomState = {
  allRoomsCount: 0,
  allRooms: [],
  rooms: [{ id: 0, name: "hihi", description: "hellohello" }],
  comments: [],
};

const roomReducer = (state = initialRoomState, action) => {
  switch (action.type) {
    case types.GET_ROOMS:
      state.allRoomsCount = action.roomsCount;
      state.allRooms = [];
      const allRooms = [...state.allRooms, ...action.rooms];
      return { ...state, allRooms };
    case types.CREATE_ROOM:
      const rooms = [...state.rooms, action.newRoom];
      return { ...state, rooms };
    case types.CREATE_COMMENT:
      const comments = [...state.comments, action.newComment];
      return { ...state, comments };
    default:
      return state;
  }
};

export default roomReducer;
