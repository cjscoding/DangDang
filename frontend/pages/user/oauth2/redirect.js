import { connect } from "react-redux";
import { useRouter } from "next/router";
import { getUserInfo } from "../../../api/user";
import { setUserInfo } from "../../../store/actions/userAction";

function mapDispatchToProps(dispatch) {
  return {
    setUserInfo: (userInfo) => dispatch(setUserInfo(userInfo)),
  };
}

export default connect(null, mapDispatchToProps)(redirect);

function redirect({ setUserInfo }) {
  const router = useRouter();
  if (
    typeof window !== "undefined" &&
    router.query.token &&
    router.query.refreshToken &&
    router.query.destination
  ) {
    /** LocalStorage에 token들 저장 */
    const authorization = `Bearer ${router.query.token}`;
    const refreshtoken = `Refresh Bearer ${router.query.refreshToken}`;
    const destination = router.query.destination;
    localStorage.setItem("authorization", authorization);
    localStorage.setItem("refreshtoken", refreshtoken);

    getUserInfo(
      ({ data: { response } }) => {
        const userInfo = {
          id: response.id,
          email: response.email,
          nickName: response.nickName,
          role: response.role,
          imageUrl: response.imageUrl,
        };
        setUserInfo(userInfo);
      },
      (error) => {
        alert("로그인 실패..");
        console.log(error);
      }
    );

    /** 원래 있던 페이지로 push */
    router.push(destination);
  }

  return null;
}
