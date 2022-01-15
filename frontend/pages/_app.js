import { wrapper } from "../store";
import '../styles/globals.css';
import Layout from '../components/Layout'
import NavBar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  return <Layout>
    <NavBar/>
    <Component {...pageProps} />
  </Layout>
};

export default wrapper.withRedux(MyApp);
