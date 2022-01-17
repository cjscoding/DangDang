import Link from "next/link";

export default function Home() {
  return <>
    <Link href="/self-practice">
      <a><h1>혼자연습한당</h1></a>
    </Link>
    <Link href="/">
      <a><h1>스터디모인당</h1></a>
    </Link>
    <Link href="/">
      <a><h1>스터디구한당</h1></a>
    </Link>
    <Link href="/">
      <a><h1>당당알아본당</h1></a>
    </Link>
  </>
};