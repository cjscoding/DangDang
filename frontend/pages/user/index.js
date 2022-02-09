import Link from "next/link";
import MyRoom from "./mypage/myroom";
import UserInfo from "./mypage/index";

export default function User() {
  return (
    <main>
      <h1>유저페이지</h1>
      <UserInfo></UserInfo>
      <MyRoom></MyRoom>
    </main>
  );
}
