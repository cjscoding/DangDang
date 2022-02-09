//팀스페이스 내 자소서
import types from "../types";

const resumeState = {
  curMemberResume: [],
};

const resumeReducer = (state = resumeState, action) => {
  switch (action.type) {
    case types.GET_RESUME:
      const curMemberResume = action.curMemberResume;
      return { ...state, curMemberResume };

    case types.NO_RESUME:
      console.log(state.curMemberResume);
      state.curMemberResume = [];
      console.log(state.curMemberResume);
      return { ...state };

    default:
      return state;
  }
};

export default resumeReducer;
