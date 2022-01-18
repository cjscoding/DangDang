import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Signup from "./Signup";

export default function NavBar() {
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(true);
  const toggleModals = () => {
    setIsHidden((curr) => !curr);
  };
  return (
    <nav>
      <Link href="/">
        <a>Home</a>
      </Link>
      <span onClick={toggleModals}>회원가입</span>
      <Signup isHidden={isHidden} />
    </nav>
  );
}
