import types from "../types";

const initialRoomState = {
  curRoomsCount: 0,
  curRooms: [],
  rooms: [],
  curRoomInfo: {},
  comments: [],
};

const roomReducer = (state = initialRoomState, action) => {
  switch (action.type) {
    case types.GET_ROOMS:
      state.curRoomsCount = action.roomsCount;
      state.curRooms = [];
      const curRooms = [...state.curRooms, ...action.rooms];
      return { ...state, curRooms };

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
