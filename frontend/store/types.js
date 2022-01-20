const post = {
  GET_POSTS: "GET_POSTS",
  GET_ROOMS: "GET_ROOMS",
  GET_MY_ROOMS: "GET_MY_ROOMS",
  SET_TEAM_NO: "SET_TEAM_NO",
}

const videoTypes = {
  SET_VIDEO: "SET_VIDEO",
}


const types = {
  ...post,
  ...videoTypes,
}
export default types;