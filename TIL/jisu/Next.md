# [Next.js](https://nomadcoders.co/nextjs-fundamentals/lobby)

---

## ๐ป SET UP

---

```
(terminal)
    with out TS > npx create-next-app@latest
    with TS     > npx create-next-app@latest --typescript

    Sass(Scss)  > npm install sass
    PostCSS     > npm install tailwindcss postcss-preset-env postcss-flexbugs-fixes
    classnames  > npm install classnames
    parse .md   > npm install gray-matter
    
```

---

---

## ๐ OVERVIEW

---

### โง Framework vs Library

|                    |                                  **framework**                                  |                **library**                |
| :----------------: | :-----------------------------------------------------------------------------: | :---------------------------------------: |
|        ๊ฐ๋        | ์ํํธ์จ์ด์ ํน์  ๋ฌธ์ ๋ฅผ ํด๊ฒฐํ๊ธฐ ์ํด ์ํธ ํ๋ ฅํ๋ ํด๋์ค์ ์ธํฐํ์ด์ค์ ์งํฉ |   ํ์ํ ๊ธฐ๋ฅ๋ค์ด ๋ชจ์ฌ์๋ ์ฝ๋์ ๋ฌถ์    |
| ์ฝ๋ ํ๋ฆ์ ์ ์ด๊ถ |                             ์์ฒด์ ์ผ๋ก ๊ฐ์ง๊ณ  ์์                              | ์ฌ์ฉ์์๊ฒ ์์ผ๋ฉฐ ํ์ํ ์ํฉ์ ๊ฐ์ ธ๋ค ์ |

> ์ฆ, framework์๋ **_์ ์ด์ ์ญ์  (IoC, Inversion of Control)_** ์ด ์ ์ฉ๋์ด ์๋ค๋ ๊ฒ

### โง pages

- pages ํด๋ ๋ด ํ์ผ๋ช์ ๋ฐ๋ผ route ๊ฒฐ์ ๋จ
  - about.js => /about ํ์ด์ง์ ๋ ๋๋ง
- **_/(๊ธฐ๋ณธ home ํ์ด์ง)_** ๋ index.js ๋ ๋๋ง
- next.js์์๋ 404 ์๋ฌ ํ์ด์ง ๊ธฐ๋ณธ ์ ๊ณตํจ

### โง Pre-rendering

> Next.js๋ ์ฑ์ ์ด๊ธฐ ์ํ๋ฅผ ํ์ฉํด ๋ฏธ๋ฆฌ ๋ ๋๋ง ํจ

- ๊ณผ์ 

  1. server๋ก๋ถํฐ HTML ํ์ผ์ ๋๊ฒจ๋ฐ์(SSR, Server Side Rendering)
  2. ๊ณ ์ ๋ HTML์ ์ฌ์ฉ์๊ฐ ์ํธ์์ฉํ  ์ ์๋๋ก JS event-listner๋ฅผ ๋ถ์<br /> => **Hydration**<br />
     -> ์ด ๊ณผ์ (_Hydration_)์์ component render ํจ์๊ฐ client-side(_ํ๋จ ์ถ๊ฐ ์ค๋ช_)์์ ์คํ๋จ

> CSR(Client Side Rendering)

- browser๊ฐ user๊ฐ ๋ณด๋ UI๋ฅผ ๋ง๋๋ ๋ชจ๋  ๊ฒ์ ํ๋ ๊ฒ
  1. browser๊ฐ JS ๊ฐ์ ธ์ด
  2. client-side JS๊ฐ ๋ชจ๋  UI ์์ฑ

> **_Warning: Text content did not match_**

- Hydration ๊ณผ์ ์์ ์๊ธฐ๋ ์ค๋ฅ
- ์ธ์ ?<br />์๋ฒ์์ ๋ด๋ ค์ค HTML ๊ฒฐ๊ณผ๋ฌผ๊ณผ Hydration ๊ณผ์ ์์ ๋ง๋ค์ด๋ธ HTML ๊ฒฐ๊ณผ๋ฌผ์ด ๋ค๋ฅผ ๋
- ex) Date.now() ๋ฉ์๋ ์ฌ์ฉ ์ SSR(Server Side Rendering)๋์ now์ Hydration ํ  ๋์ now๊ฐ ๋ค๋ฆ

### โง Routing

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

> a ํ๊ทธ์์๋ง ํด๋์ค, ์คํ์ผ ๋ฑ ์ ์ฉ๊ฐ๋ฅ<br /> > **_useRouter()_** : next์์ ์ ๊ณตํ๋ hook (**_pathname_** property ํ์ฉ)

### โง CSS ์ ์ฉ๋ฐฉ์

> tag์ ๋ฐ๋ก style={{}} ์ ์ฉ

```javascript
<a
  className="hello"
  style={{ color: router.pathname === "/" ? "red" : "blue" }}
>
  Google
</a>
```

> CSS Modules

- .module.css ํ์ผ ๊ฒฝ๋ก๋ฅผ importํด ์ฌ์ฉํ๋ ๋ฐฉ์
- ํด๋์ค๋ช์ ์ฌ๋ฌ๊ฐ ๋ถ์ผ ๋

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

- ๋๋

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

> Styles JSX(!!๊ฐ์ฅ ์ถ์ฒํ๋ ๋ฐฉ์!!)

- Next.js์ ๊ณ ์ ๋ฐฉ์
- import ์์ ํ์ ์์
- ๋ถ๋ชจ ์ปดํฌ๋ํธ์์ ๊ฐ์ ์ด๋ฆ์ ํด๋์ค๋ฅผ ์ฌ์ฉํ๋๋ผ๋ ์ ์ฉ๋์ง ์์ => ๋๋ฆฝ์ 

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

  - hello.js ์ a ํ๊ทธ๋ ์คํ์ผ์ด ์ ์ฉ๋์ง๋ง index.js์ h1์๋ ์คํ์ผ ์ ์ฉ ์๋จ

    - ์ปดํฌ๋ํธ ๋ด๋ถ๋ก ๋ฒ์๊ฐ ํ์ ๋๊ธฐ ๋๋ฌธ

      |    Next.js    |      Vue.js      |
      | :-----------: | :--------------: |
      | < style jsx > | < style scoped > |

> Global Styles (CSS ์ ์ญ์ผ๋ก ์ ์ฉ ์)

- < style jsx global > ํ์
- But, ์ ์ญ ์ ์ฉ์ ์ํด์๋ \_app.js ํ์ฉ ๊ถ์ฅ

### โง Custom App

> Next.js์ ๋ ๋๋ง ์์

1. \_app.js
2. index.js
3. others...

> \_app.js

- ์๋ฒ๋ก ์์ฒญ์ด ๋ค์ด์์ ๋ ๊ฐ์ฅ ๋จผ์  ์คํ๋๋ ์ปดํฌ๋ํธ
- ์ฃผ ์ฌ์ฉ ๋ชฉ์ ?  
   ๋ชจ๋  ์ปดํฌ๋ํธ์ ๊ณตํต์ผ๋ก ์ ์ฉํ  ์์ฑ ๊ด๋ฆฌ

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

  - Component๋ฅผ Props ํํ๋ก ๋ด๋ ค๋ฐ๋ ํ์
  - ์ ์ฝ๋์์๋ globals.css์ NavBar ์ปดํฌ๋ํธ ๊ณตํต ์ ์ฉ
    - **์ฆ, ํ์ด์ง๋ค์ด ๋ณํํด๋ layout์ด ์ ์ง๋จ**
  - ์๋ฒ์ ์์ฒญํ ํ์ด์ง๊ฐ Component์ ์์ฑ๊ฐ
    - ex) http://localhost:3000/hello -> Component : hello

---

---

## โญ๏ธ ADDITIONAL CONCEPTS

---

### โง Patterns

> html > head > title ๋ณ๊ฒฝ ์

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

- ๋๋

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

  => page ๋ณ๋ก props๋ฅผ ๋ด๋ ค head title์ ๋ค๋ฅด๊ฒ ์ค์ 

  ### โง Fetching Data

  >

  ### โง Redirect

  > next.config.js ํ์ผ ๋ด์์

  ```javascript
  module.exports = {
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: "/contact:path",
          destination: "/form:path",
          permanent: false,
        },
      ];
    },
  };
  ```

  - url : /contact ์ ์์ /form ์ผ๋ก redirect๋จ
  - :path๋ก ๊ฐ์ path ์ ๋ณด๋ฅผ ๊ฐ์ง๊ณ  url ์ด๋๊ฐ๋ฅ
  - ๋ค๋ฐ๋ผ์ค๋ ๋ชจ๋  path๋ฅผ catchํ๊ธฐ ์ํด์๋ :path\*

  ### โง Rewrite

  ```javascript
  const API_KEY = process.env.API_KEY;

  module.exports = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: "/api/movies",
          destination: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
        },
      ];
    },
  };
  ```

  - user๊ฐ url์ api_key๋ฅผ ๋ณด์ง ๋ชปํ๋๋ก ์จ๊ธธ ์ ์์
  - api key๋ .envํ์ผ์ ์ ์ฅ

  ### โง Dynamic Routes

  > pages ํด๋ ๋ด ํด๋ ๋๋ ํ์ผ๋ก route ๊ฒฐ์ ๋จ

  - ์๋ฅผ ๋ค์ด, ํ์ด์ง๊ฐ ํ๋๋ผ๋ฉด about.js => /about
  - ๋ ์ด์์ด๋ฉด,
    - about(ํด๋) > index.js => /about
    - about(ํด๋) > all.js => /about/all
