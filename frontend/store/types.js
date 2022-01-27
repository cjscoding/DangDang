const teamBoard = {
  CREATE_ROOM: "CREATE_ROOM",
  CREATE_COMMENT: "CREATE_COMMENT",
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
  SET_ISLOGIN: "SET_ISLOGIN",
  RESET_USERINFO: "RESET_USERINFO",
};

const types = {
  ...teamBoard,
  ...videoTypes,
  ...questionTypes,
  ...userTypes,
};

export default types;
