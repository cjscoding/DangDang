import { wrapper } from "../store";
import "../scss/main.scss";
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  return <Layout>
    <Component {...pageProps} />
  </Layout>
};

export default wrapper.withRedux(MyApp);
