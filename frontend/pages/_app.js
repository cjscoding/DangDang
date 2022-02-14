import { wrapper } from "../store";
import Script from "next/script";
import Layout from "../components/Layout";
import "../scss/main.scss";
import { WEBRTC_URL } from "../config"
import { useEffect } from "react";
import { store } from "../store"
import { setUserInfo, setIsLogin } from "../store/actions/userAction"
import { getUserInfo } from "../api/user"
// fontawesome
import '@fortawesome/fontawesome-free/js/fontawesome'; 
import '@fortawesome/fontawesome-free/js/solid'; 
import '@fortawesome/fontawesome-free/js/regular'; 
import '@fortawesome/fontawesome-free/js/brands';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    function autoLogin() {
      if(
        localStorage.getItem("authorization") &&
        localStorage.getItem("refreshtoken")
      ) {
        if (!store.getState().userReducer.user.id) {
          getUserInfo(
            ({ data: { response } }) => {
              const userInfo = {
                id: response.id,
                email: response.email,
                nickName: response.nickName,
                imageUrl: response.imageUrl,
              };
              store.dispatch(setUserInfo(userInfo));
            },
            (error) => {
              store.dispatch(setIsLogin(false))
              console.log(error);
            }
          );
        }else if(!store.getState().userReducer.isLogin){
          store.dispatch(setIsLogin(true))
        }
      }
    }
    store.subscribe(autoLogin)
    if (
      localStorage.getItem("authorization") &&
      localStorage.getItem("refreshtoken")
    ) {
      store.dispatch(setIsLogin(true))
    }
  }, [])

  return (
    <Layout>
      <Script src={`${WEBRTC_URL}/js/kurento-utils.js`}></Script>
      <Component {...pageProps} />
    </Layout>
  );
}

export default wrapper.withRedux(MyApp);