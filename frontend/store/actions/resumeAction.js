import types from "../types";

export const setResume = (resArray) => {
    console.log(resArray);
  if (resArray.length > 0) {
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
