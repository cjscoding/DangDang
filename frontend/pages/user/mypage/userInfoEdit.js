import Link from "next/link";

export default function userInfoEdit() {
  return (
    <form method="POST">
      <div>
        <label>
          이메일:
          <input type="email" required />
        </label>
      </div>
      <div>
        <label>
          비밀번호:
          <input type="password" required />
        </label>
      </div>
      <div>
        <label>
          이름:
          <input type="text" required />
        </label>
      </div>
      <Link href="/user">
        <a>
          <button type="submit">확인</button>
        </a>
      </Link>
      <Link href="/user">
        <a>
          <button>취소</button>
        </a>
      </Link>
    </form>
  );
}
