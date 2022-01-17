# NextJS Introduction

## Setup

```bash
npx create-next-app@latest
√ What is your project named? ... nextjs-intro
Creating a new Next.js app in C:\Users\SSAFY\Desktop\TIL\React\nextjs-intro.

Using npm.

Installing dependencies:
- react
- react-dom
- next
```

`create-next-app@latest` 명령어를 사용하면 자동으로 next가 설치된다.

- typescript 사용 버전

```bash
npx create-next-app@latest --typescript
```

## Library vs Framework

| Library                                                                                                     | Framework                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 개발자가 불러와서 자유롭게 사용하는 것                                                                      | 미리 짜여진 틀을 기반으로 코드를 작성하는 것                                                                                                   |
| `I call the library.`                                                                                       | `Framework calls my code.`                                                                                                                     |
| 예) `React.js`는 내가 원할 때 부르고 커스텀할 수 있는 `Library`: 내 마음대로 프로젝트 구조를 설정할 수 있다 | 예) `Next.js`는 사용법에 맞게 내 코드를 넣으면 동작하는 `Framework`: `pages`에 `.js` 파일을 넣었더니 아무것도 하지 않아도 페이지가 만들어졌어! |

## Pages 폴더로 Routing 하기

- Next.js에서는 `pages` 폴더 밑의 `.js` 파일들이 라우팅 경로가 된다.
  - `pages/about.js` -> `localhost/about`
- 파일은 React Component를 반환하게끔 작성한다.

```javascript
export default function MyComponent() {
  // return jsx..
  return <div></div>;
}
```

- 파일 이름이 경로 이름이 되고, 컴포넌트 이름은 상관 없다.

## CSS Module 사용하기

- 웹 사이트들을 보면, 이상한 클래스명으로 되어있을 때가 있어서 팀에서 합의한 규칙인건가? 했는데 CSS Module을 사용하면 랜덤으로 클래스명을 지어주는 거였다..

1. `fileName.module.css` 파일 생성
2. `fileName.module.css`에 CSS 코드 작성

```css
.nav {
  display: flex;
  justify-content: space-between;
  background-color: tomato;
}
```

3. JavaScript에서 모듈을 import 한다.

```javascript
import styles from "./NavBar.module.css";
```

4. 적용은 이렇게!

```javascript
export default function NavBar() {
  return <nav className={styles.nav}></nav>;
}
```

- `className="nav"`처럼 텍스트로 적는 게 아니라, `className={styles.nav}`로 Javascript로 적어줘야 한다.

5. 한 태그에 여러 개의 클래스가 들어가야 하면 어떡해?

- CSS 파일

  ```css
  .active {
    color: tomato;
  }

  .link {
    text-decoration: none;
  }
  ```

  - 여기서 link는 상시 적용하고, `active`는 현재 선택 중인 메뉴에만 부여하고 싶어!

- 5-1. 백틱으로 여러 개의 클래스 넣기

  ```javascript
  <a className={`${styles.link} ${router.pathname === "/" ? styles.active : ""}`}>
  ```

- 5-2. 배열과 `join()` 메소드 활용하기

  ```javascript
  <a className={[styles.link, router.pathname === "/about" ? styles.active : ""].join(" ")}>
  ```

## Style JSX 사용하기

```javascript
<style jsx>{`
  nav {
    background-color: tomato;
  }
  a {
    text-decoration: none;
  }
`}</style>
```

- JSX 리턴문에다가 `<style jsx>` 쓰고, ` {``} ` 안에 평범하게 CSS문을 쓰면 그대로 동작한다.

## Style JSX의 장점

- CSS 파일을 만들지 않아도 된다.
- 독립적이다: 부모 컴포넌트에서 쓴 태그, id, 클래스명을 자식 컴포넌트에서도 써도 된다!!
  - id, 클래스명을 짓느라 머리아플 일이 줄어든다.

## Global Style 적용하기 & `_app.js`

- `reset`, `font-family` 등 global style을 적용하려면 어떻게 해야 할까?

```javascript
<style jsx global>
  {`
    a {
      text-decoration: none;
    }
  `}
</style>
```

- 간단하게 `global` 키워드를 붙이면 될 줄 알았는데……?
- 다른 페이지(컴포넌트)로 이동하면 `global` 설정이 먹지 않는다.

### `_app.js`

- `Next.js`가 가장 먼저 실행하는 컴포넌트
- 공통 레이아웃 역할
- 모든 컴포넌트에 공통으로 적용할 속성을 관리

```javascript
export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
```

- `Component`: 서버에 요청한 페이지
  - `http://localhost:3000/home` 이라면, `Home` 컴포넌트
- `pageProps`: `getInitialProps`, `getStaticProps`, `getServerSideProps` 중 하나를 통해 페칭한 조기 속성값

## Next.js에서의 static image 관리

- `public` 폴더에 이미지를 넣으면 됨
- `<img src="">`에는 복잡한 경로 대신 `src="/vercel.svg`처럼 간단하게 작성 가능

## Next.js에서 Redirect 하기

- `next.config.js`를 수정해서 웹페이지를 redirect할 수 있다.

```javascript
async redirects() {
    return [
      {
        source: "/old/:path*",
        destination: "/new/:path*",
        permanent: false,
      },
    ];
  },
```

- source: 우리가 접속할 예전 주소.
- destination: 새로 redirect 할 새 주소
  - `:path` 하면 `old/123123` 처럼 뒤에 경로를 인식한다.
  - `*`는 모든 경로를 인식함. `old/123123/comments/2` 등등..
- permanent: 영구적인지 아닌지? 검색엔진 등이 기록한다고 한다.
- 개발 서버의 설정 파일을 변경했으므로 반드시 `재시작`해줘야 한다.

## API Key 숨기기: Rewrites

### 왜 숨겨야 하나요?

- API Key를 숨기지 않으면, 개발자 모드나 소스보기 등으로 다른 사람들이 내 API Key를 알 수 있다.
- 만약 다른 사람들이 내 API Key를 멋대로 가져다 쓴다면...? -> 보안 중요!

### rewrites

- `rewrites`는 `redirects`와 동일하게 동작하나, 주소창이 변경되지 않는다.
- `rewrites`를 응용하여 API KEY를 숨기는 가짜 fetching url을 만들어보자.

```javascript
 async rewrites() {
    return [
      {
        source: "/api/movies",
        destination: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
      },
    ];
  },
```

## 100% SSR 하기: getServerSideProps

- `getServerSideProps()` 함수를 만들면, 서버단에서 코드가 실행된다.
  - 클라이언트에겐 안 보이니까, 이렇게 API KEY를 숨겨도 된다.
- `getServerSideProps()`는 object를 리턴한다.

```javascript
export async function getServerSideProps() {
  const { results } = await (
    await fetch(`http://localhost:3000/api/movies`)
  ).json();
  return {
    props: {
      results,
    },
  };
}
```

- 이 return된 object는...

```javascript
export default function App({ Component, pageProps }) {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
```

- `pageProps` 속성으로 전달되어, 컴포넌트는 `props`처럼 사용할 수 있다.
- 백엔드에서 데이터를 받아옴 -> props로 React에 전달 -> React가 props를 사용하여 프론트엔드 조작
- 내 웹사이트가 서버 사이드 렌더링이 좋은지, 혹은 클라이언트 사이드 렌더링이 좋은지 경우를 잘 생각해서 활용해보자.

## Dynamic Routing

- 아주 쉽다.
- `[parameter].js` 처럼 parameter를 `[]`로 감싸주면 완성됨
  - 파일명이 `[id].js`라면, `localhost:3000/123123` 처럼 동적 라우팅이 가능!

## Router로 URL Masking

- URL에 쿼리가 있으면 보기 싫잖아! => URL Masking을 할 수 있다.

```javascript
router.push(
  {
    pathname: `/movies/${id}`,
    query: {
      title,
    },
  },
  `/movies/${id}`
);
```

- pathname: 이동할 주소
- query: query string을 object 형태로 작성한다.
- 그리고 콤마 찍고 마스킹할 URL을 작성하면, URL이 마스킹된다! 만세!
- 보낸 쿼리는 `{router.query.title}`처럼 router로 받아서 사용하면 되는데...
- 문제는, 사용자가 직접 클릭해서 들어간 게 아니라 주소를 외워서 바로 접근하면 뜨지 않는다! (라우터를 거친 게 아니니까)

## Catch All URL

- 파일 이름: `[param].js`이 아닌, `[...params].js`로 지어준다. 끝!
- `router.query.params`의 배열로 query 값에 접근할 수 있음.

## 404 예외 처리

- 그냥 `pages` 폴더에 `404.js`를 만들기만 하면 된다...
