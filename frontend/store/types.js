const teamBoard = {
  CREATE_ROOM: "CREATE_ROOM",
  CREATE_COMMENT: "CREATE_COMMENT",
};

const videoTypes = {
  SET_VIDEO: "SET_VIDEO",
  SET_CAMERA: "SET_CAMERA",
  SET_MIC: "SET_MIC",
  SET_SPEAKER: "SET_SPEAKER",
}

const questionTypes = {
  ADD_QUESTION: "ADD_QUESTION",
  SET_QUESTIONS: "SET_QUESTIONS",
}

const types = {
  ...teamBoard,
  ...videoTypes,
  ...questionTypes,
}
export default types;
