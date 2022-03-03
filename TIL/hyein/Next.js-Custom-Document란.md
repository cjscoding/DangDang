# Next.js Custom Document란?

- Next.js로 모달창을 구현하기 위해 `Custom Document`를 사용했다.
- Custom Document(`_document.js`)이란 무엇인지, `_app.js`와 비교하며 알아보자.

## \_app.js

- 서버로 요청이 들어왔을 때 가장 먼저 실행되는 컴포넌트
- `pages/_app.js`를 수정하여 커스텀이 가능하다.

### 이럴 때 사용해요

- `공통 속성을 관리하고 싶을 때`
  - 페이지가 변해도 레이아웃을 유지하고 싶을 때
  - 라우팅되는 페이지들의 state를 유지하고 싶을 때
  - `componentDidCatch`을 사용하여 커스텀 에러 관리
  - 페이지에 추가 데이터를 주입
  - global CSS 적용

### 특징

1. `Component`는 내가 현재 보고 있는 페이지 = 서버에 요청한 페이지이다.

```javascript
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

2. `_app.js`가 수정되면 개발 서버를 껐다 켜야 한다. 서버에서 실행되니까 그렇겠죠?
3. `getInitialProps`를 사용할 때는 `Automatic Static Optimization`을 사용할 수 없다.

   - 사용할 때는 반드시! `App` 객체를 import한 뒤 `getInitialProps`를 호출하는 식으로 작성해야 한다. (아래처럼)

   ```javascript
   import App from "next/app";

   function app({ Component, pageProps }) {
     return <Component {...pageProps} />;
   }

   app.getInitialProps = async (appContext) => {
     const appProps = await App.getInitialProps(appContext);

     return { ...appProps };
   };
   ```

4. `_app.js`는 `getStaticProps`, `getServerSideProps`와 같은 Data Fetching을 사용할 수 없다. (당연함! 서버에서 실행되니까)

## \_document.js

- `_app.js` 다음에 실행되는 컴포넌트.
- `pages/_document.js`를 수정하여 커스텀이 가능하다.

### 이럴 때 사용해요 : HTML 공통 속성 관리

- `<head>`, `<meta>` 등 프로젝트에서 공통으로 사용될 HTML 마크업을 커스텀할 때

### 특징

1. `next/document`의 `Document` 클래스를 상속받음
   - 현재로써는 `class` 형식으로만 작성

```javascript
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

2. `_document.js`는 항상 서버에서 돌아간다.

   - `onClick` 같은 event handler는 작성 불가

3. `<Main />` 밖에 작성된 컴포넌트들은 렌더링되지 않는다.

   - 비지니스 로직, 커스텀 CSS(`styled jsx`) 등을 작성하면 안된다!
   - 만약 `Navbar`, `footer` 등 특정 레이아웃을 고정하고 싶다면 `_app.js`에!

4. `Document`의 `getInitialProps`는...

   - 클라이언트에서 실행되지 않는다.
   - 다른 `getInitialProps`와는 달리, `Automatic Static Optimization`에도 영향받지 않는다.

5. 마찬가지로 `getStaticProps`, `getServerSideProps`와 같은 Data fetching을 사용할 수 없다. (당연함 서버에서 돌아가니까)

## 그래서, 둘이 무슨 차이인데요?

![_app.js과-_document.js](https://user-images.githubusercontent.com/25563077/150930930-313aaaf4-4b29-4cdd-a8f4-ef6a3f459a45.png)

- 모달은 메인 컴포넌트와 별개로 동작하므로, `_app.js` 안의 컴포넌트로 구현하기보다는, `_document.js`에 따로 위치해놓고 `ReactDOM.createPortal()`을 사용하여 구현하였습니다!
