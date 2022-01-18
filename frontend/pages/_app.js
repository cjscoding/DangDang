import { wrapper } from "../store";
import Layout from "../components/Layout";
import NavBar from "../components/Navbar";
import { useRouter } from "next/router";
import "../scss/main.scss";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <Layout>
      {router.pathname === "/" ? null : <NavBar />}
      <Component {...pageProps} />
    </Layout>
  );
}

export default wrapper.withRedux(MyApp);
