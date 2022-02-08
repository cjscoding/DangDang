//팀스페이스 내 자소서
import types from "../types";

export const setResume = (resArray) => {
  if (resArray.length > 0) {
      console.log(resArray);
    return {
      type: types.GET_RESUME,
      curMemberResume: resArray,
    };
  } else {
    return {
      type: types.NO_RESUME,
      curMemberResume: [],
    };
  }
};
