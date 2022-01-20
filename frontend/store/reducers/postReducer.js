import types from "../types";

const initialState = {
  posts: [],
  hosts: [],
  post: {},
  rooms: [],
  myRooms: [],
  teamNos: [],
  loading: false,
  error: null,
};

export default function postReducer(state=initialState, action) {
  switch (action.type) {
    case types.GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        hosts: action.host,
        teamNos: action.teamNo,
        loading: false,
        error: null,
      };
    case types.GET_ROOMS:
      return {
        ...state,
        rooms: action.keywords,
      };
    case types.GET_MY_ROOMS:
      return {
        ...state,
        myRooms: action.keywords,
      };
    default:
      return state;
  }
}
