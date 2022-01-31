import types from "../types";

const initialRoomState = {
  allRoomsCount: 0,
  allRooms: [],
  rooms: [],
  curRoomInfo: {},
  comments: [],
};

const roomReducer = (state = initialRoomState, action) => {
  switch (action.type) {
    case types.GET_ROOMS:
      state.allRoomsCount = action.roomsCount;
      state.allRooms = [];
      const allRooms = [...state.allRooms, ...action.rooms];
      return { ...state, allRooms };

    case types.GET_ROOM_INFO:
      console.log("reducer!!");
      const curRoomInfo = { ...state.curRoomInfo, ...action.roomInfo };
      return { ...state, curRoomInfo };

    case types.CREATE_COMMENT:
      const comments = [...state.comments, action.newComment];
      return { ...state, comments };

    default:
      return state;
  }
};

export default roomReducer;
