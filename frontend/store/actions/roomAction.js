import types from "../types";

//모든 스터디 조회(+ pagination)
export const setAllRooms = (roomList) => ({
  type: types.GET_ROOMS,
  rooms: roomList.rooms,
  roomsCount: roomList.roomsCount,
});

//마이룸 조회
export const setMyRooms = (myRoomList) => ({
  type: types.MY_ROOMS,
  myRooms: myRoomList.myRooms,
  myRoomsCount: myRoomList.myRoomsCount,
});

//스터디룸 단일 조회
export const setRoomInfo = (roomData) => {
    console.log(roomData);
  return {
    type: types.GET_ROOM_INFO,
    roomInfo: roomData.roomInfo,
    host: roomData.host,
    members: roomData.members,
    comments: roomData.comments,
  };
};

//스터디룸 가입 대기 명단 조회
export const setWaitings = (waitings) => ({
  type: types.WAITING_MEMBERS,
  waitings,
});
