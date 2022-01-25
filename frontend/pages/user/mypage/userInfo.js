import Link from "next/link";

export default function userInfo() {
  const userName = "보리";
  const userEmail = "bori@dangdang.com";
  return (
    <section>
      <div className="profileImage">프로필사진</div>
      <div className="profile">
        <p>이름: {userName}</p>
        <p>이메일: {userEmail}</p>
        <Link href="/user/mypage/userInfoEdit" as="/user">
          <a>
            <button>변경</button>
          </a>
        </Link>
      </div>
    </section>
  );
}
