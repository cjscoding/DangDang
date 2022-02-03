const teamBoard = {
  GET_ROOMS: "GET_ROOMS",
  GET_ROOM_INFO: "GET_ROOM_INFO",
  CREATE_ROOM: "CREATE_ROOM",
  MY_ROOMS: "MY_ROOMS",
  WAITING_MEMBERS: "WAITING_MEMBERS",
};

const teamSpace = {
  GET_RESUME: "GET_RESUME",
  NO_RESUME: "NO_RESUME",
};

const videoTypes = {
  SET_VIDEO: "SET_VIDEO",
  SET_CAMERA: "SET_CAMERA",
  SET_MIC: "SET_MIC",
  SET_SPEAKER: "SET_SPEAKER",
};

const questionTypes = {
  ADD_QUESTION: "ADD_QUESTION",
  SET_QUESTIONS: "SET_QUESTIONS",
};

const userTypes = {
  SET_USERINFO: "SET_USERINFO",
  SET_SHOWMODAL: "SET_SHOWMODAL",
  SET_ISLOGINMODAL: "SET_ISLOGINMODAL",
  RESET_USERINFO: "RESET_USERINFO",
};

const types = {
  ...teamBoard,
  ...teamSpace,
  ...videoTypes,
  ...questionTypes,
  ...userTypes,
};

export default types;
