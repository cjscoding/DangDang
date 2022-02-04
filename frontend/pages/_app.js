import { wrapper } from "../store";
import Layout from "../components/Layout";
import "../scss/main.scss";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
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
