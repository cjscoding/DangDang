import types from "../types";

const roomState = {
  //   스터디 전체 조회
  // 스터디룸 필터링 후 조회
  curRoomsCount: 0,
  curRooms: [],
  //스터디룸 상세 보기
  comments: [],
  curRoomInfo: {},
  curRoomHost: "",
  curRoomMembers: [],
  //마이룸 조회
  myRoomsCount: 0,
  myRooms: [],
  //팀스페이스
  waitings: [],
};

const roomReducer = (state = roomState, action) => {
  switch (action.type) {
    case types.GET_ROOMS:
      state.curRoomsCount = action.roomsCount;
      state.curRooms = [];
      const curRooms = [...state.curRooms, ...action.rooms];
      return { ...state, curRooms };

    case types.GET_ROOM_INFO:
      const curRoomInfo = action.roomInfo;
      const curRoomHost = action.host;
      const curRoomMembers = action.members;
      return {...state, curRoomInfo, curRoomHost, curRoomMembers};

    case types.CREATE_COMMENT:
      const comments = [...state.comments, action.newComment];
      return { ...state, comments };

    case types.MY_ROOMS:
      state.myRoomsCount = action.myRoomsCount;
      state.myRooms = [];
      const myRooms = [...state.myRooms, ...action.myRooms];
      return { ...state, myRooms };

    case types.WAITING_MEMBERS:
      state.waitings = [];
      const waitings = [...state.waitings, ...action.waitings];
      return { ...state, waitings };

    default:
      return state;
  }
};

export default roomReducer;
