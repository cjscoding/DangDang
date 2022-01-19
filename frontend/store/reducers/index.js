import { combineReducers } from "redux";
import { postReducer, roomReducer, myRoomReducer } from "./postReducer";
export default combineReducers({
  post: postReducer,
  room: roomReducer,
  myRoom: myRoomReducer,
});
