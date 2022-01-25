import { wrapper } from "../store";
import Layout from "../components/Layout";
import NavBar from "../components/Navbar";
import { useRouter } from "next/router";
import "../scss/main.scss";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <Layout>
      <Script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></Script>
      {router.pathname === "/" ? null : <NavBar />}
      <Component {...pageProps} />
    </Layout>
  );
}

export default wrapper.withRedux(MyApp);

// import App from "next/app";
// import React from "react";
// import { createWrapper } from "next-redux-wrapper";
// import store from "../store/store";
// import "../scss/";
// import NavBar from "../components/navbar";

// class MyApp extends App {
//   render() {
//     const { Component, pageProps } = this.props;
//     return (
//       <div>
//         <Layout>
//       {router.pathname === "/" ? null : <NavBar />}
//       <Component {...pageProps} />
//     </Layout>
//       </div>
//     );
//   }
// }

// const makestore = () => store;
// const wrapper = createWrapper(makestore);

// export default wrapper.withRedux(MyApp);