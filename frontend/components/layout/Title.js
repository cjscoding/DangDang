import Head from "next/head";
export default function Title({ title }) {
  return (
    <Head>
      <title>{title} | 당당하게 면접보자!</title>
    </Head>
  );
}
