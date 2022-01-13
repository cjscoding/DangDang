# [Next.js](https://nomadcoders.co/nextjs-fundamentals/lobby)

---

## 💻 SET UP

---

```
(terminal)
    with out TS > npx create-next-app@latest
    with TS     > npx create-next-app@latest --typescript
```

---

---

## 👀 OVERVIEW

---

### ✧ Framework vs Library

|                    |                                  **framework**                                  |                **library**                |
| :----------------: | :-----------------------------------------------------------------------------: | :---------------------------------------: |
|        개념        | 소프트웨어의 특정 문제를 해결하기 위해 상호 협력하는 클래스와 인터페이스의 집합 |   필요한 기능들이 모여있는 코드의 묶음    |
| 코드 흐름의 제어권 |                             자체적으로 가지고 있음                              | 사용자에게 있으며 필요한 상황에 가져다 씀 |

> 즉, framework에는 **_제어의 역전 (IoC, Inversion of Control)_** 이 적용되어 있다는 것

### ✧ pages

- pages 폴더 내 파일명에 따라 route 결정됨
  - about.js => /about 페이지에 렌더링
- **_/(기본 home 페이지)_** 는 index.js 렌더링
- next.js에서는 404 에러 페이지 기본 제공함

### ✧ Pre-rendering

> Next.js는 앱의 초기 상태를 활용해 미리 렌더링 함

- 과정

  1. server로부터 HTML 파일을 넘겨받음(SSR, Server Side Rendering)
  2. 고정된 HTML에 사용자가 상호작용할 수 있도록 JS event-listner를 붙임<br /> => **Hydration**<br />
     -> 이 과정(_Hydration_)에서 component render 함수가 client-side(_하단 추가 설명_)에서 실행됨

> CSR(Client Side Rendering)

- browser가 user가 보는 UI를 만드는 모든 것을 하는 것
  1. browser가 JS 가져옴
  2. client-side JS가 모든 UI 생성

> **_Warning: Text content did not match_**

- Hydration 과정에서 생기는 오류
- 언제?<br />서버에서 내려준 HTML 결과물과 Hydration 과정에서 만들어낸 HTML 결과물이 다를 때
- ex) Date.now() 메소드 사용 시 SSR(Server Side Rendering)때의 now와 Hydration 할 때의 now가 다름

### ✧ Routing

```javascript
import Link from "next/link";
import { useRouter } from "next/router";

export default function NavBar() {
  const router = useRouter();

  return (
    <nav>
      <Link href="/">
        <a
          className="hello"
          style={{ color: router.pathname === "/" ? "red" : "blue" }}
        >
          Google
        </a>
      </Link>
    </nav>
  );
}
```

> a 태그에서만 클래스, 스타일 등 적용가능<br /> > **_useRouter()_** : next에서 제공하는 hook (**_pathname_** property 활용)

### ✧ CSS 적용방식

> tag에 바로 style={{}} 적용

```javascript
<a
  className="hello"
  style={{ color: router.pathname === "/" ? "red" : "blue" }}
>
  Google
</a>
```

> CSS Modules

- .module.css 파일 경로를 import해 사용하는 방식
- 클래스명을 여러개 붙일 때

  ```javascript
  import styles from "./NavBar.module.css";

  ...

  <a
    className={`${styles.link} ${
        router.pathname === "/" ? style.active : "" }`}
  >
    Google
  </a>
  ```

- 또는

  ```javascript
  import styles from "./NavBar.module.css";

  ...

  <a
    className={[
      styles.link,
      router.pathname === "/" ? style.active : ""
    ].join(" ")}
  >
  Google
  </a>
  ```

> Styles JSX(!!가장 추천하는 방식!!)

- Next.js의 고유방식
- import 작업 필요 없음
- 부모 컴포넌트에서 같은 이름의 클래스를 사용하더라도 적용되지 않음 => 독립적

  ```javascript
  //Hello.js
  import Link from "next/link";
  import { useRouter } from "next/router";

  export default function NavBar() {
  const router = useRouter();

  return (
    <nav>
      <Link href="/">
        <a
          className="hello"
        >
          Google
        </a>
      </Link>
      <style jsx>{`
        .hello{
            color: red;
        }
      `}</style>
    </nav>
  );
  }

  //index.js
  import Hello from "Hello.js";

  export default function Welcome() {

  return (
    <div>
        <h1 className="hello">Welcome!</h1>
        <Hello />
    </div>
  );
  }
  ```

  - hello.js 의 a 태그는 스타일이 적용되지만 index.js의 h1에는 스타일 적용 안됨

    - 컴포넌트 내부로 범위가 한정되기 때문

      |    Next.js    |      Vue.js      |
      | :-----------: | :--------------: |
      | < style jsx > | < style scoped > |

> Global Styles (CSS 전역으로 적용 시)

- < style jsx global > 형식
- But, 전역 적용을 위해서는 \_app.js 활용 권장

### ✧ Custom App

> Next.js의 렌더링 순서

1. \_app.js
2. index.js
3. others...

> \_app.js

- 서버로 요청이 들어왔을 때 가장 먼저 실행되는 컴포넌트
- 주 사용 목적?  
   모든 컴포넌트에 공통으로 적용할 속성 관리

  ```javascript
  import NavBar from "../components/NavBar";
  import "../styles/globals.css";

  export default function MyApp({ Component, pageProps }) {
    return (
      <>
        <NavBar />
        <Component {...pageProps} />
      </>
    );
  }
  ```

  - Component를 Props 형태로 내려받는 형식
  - 위 코드에서는 globals.css와 NavBar 컴포넌트 공통 적용
    - **즉, 페이지들이 변화해도 layout이 유지됨**
  - 서버에 요청한 페이지가 Component의 속성값
    - ex) http://localhost:3000/hello -> Component : hello

---

---

## ⭐️ ADDITIONAL CONCEPTS

---

### ✧ Patterns

> html > head > title 변경 시

```javascript
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home | Next.js</title>
      </Head>
    </div>
  );
}
```

- 또는

  ```javascript
  //title.js
  import Head from "next/head";

  export default function Title({ title }){
      return(
          <Head>
            <title>{title} | Next.js</title>
          </Head>
      );
  }

  //home.js
  import Title from "../components/title";

  export default function Home(){
      return(
          <Title title="Home"></Title>
      )
  }

  //about.js
  import Title from "../components/title";

  export default function About(){
      return(
          <Title title="About"></Title>
      )
  }
  ```

  => page 별로 props를 내려 head title을 다르게 설정

  ### ✧ Fetching Data

  > 
