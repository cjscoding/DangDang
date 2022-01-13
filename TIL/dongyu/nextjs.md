### API_KEY 숨기기

> redirects
>
> > ```jsx
> > // next.config.js
> > module.exports = {
> >   ...,
> >   async redirects(){
> >     return [
> >       {
> >         source: "/old/:path*",
> >         destination: "/new/:path*",
> >         permanent: false,
> >       }
> >     ]
> >   },
> > }
> > ```
> >
> > 이러면, /old 로 시작하는 모든 주소는 /new 로 시작하는 주소로 바뀌어 이동한다.
> >
> > (param이 여러개일 때는 /:param1/:param2/:param3 이렇게 해야하는 줄 알았는데, *를 써서 한번에 받을 수 있었다니,,!!)
>
> rewrites (masking?)
>
> > ```jsx
> > // next.config.js
> > const API_KEY = process.env.API_KEY;
> > 
> > module.exports = {
> >   ...,
> >   async rewrites() {
> >     return [
> >       {
> >         source: "/api/movies",
> >         destination: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
> >       }
> >     ];
> >   },
> > }
> > ```
> >
> > 이러면, /api/movies의 주소는 https://api.themoviedb.org/3/movie/popular?api_key=API_KEY의 결과를 가져온다.
> >
> > 따라서, 사용자 입장에서 API_KEY가 안보이게 된다.

### SSR (Server Side Rendering)

> ```jsx
> export async function getServerSideProps() {
> 	...
> }
> ```
>
> getServerSideProps() 함수(이름 바꾸면 안됨)를 사용하면, 내부 코드는 서버 사이드에서 동작하게 된다.
>
> (서버 사이드에서 동작하므로, API_KEY를 사용해도, 결과를 유저에게 보내주므로, API_KEY를 숨길수 있다.)

### Router

> react에서는 react-router-dom 을 설치해, BrowserRouter, Routes, Route 등을 사용했다.
>
> 하지만, nextjs에서는 다르다.
>
> nextjs는 pages폴더에 있는 파일들의 구조가 각각의 주소가 된다.
>
> ```jsx
> pages/movies/detail.js  =>  /movies/detail
> pages/movies/index.js  => /movies
> pages/movie.js  =>  /movie
> pages/movies/[param].js  =>  /movies/param
> pages/movies/[...params].js  =>  /movies/param1/param2/param3/...
> pages/404.js  =>  존재하지 않는 페이지
> ```
>
> param을 쓰게 되면, []로 감싸 파일 이름을 만들어주면 된다.
>
> 해당 요소의 param은 next/router의 useRouter()를 사용하여 알 수 있다.

### Page 이동

> ```jsx
> router.push({
>     pathname: `/movies/${id}`,
>     query: {
>         title: title,
>     }
> }, `/movies/${id}`);
> ```
>
> ```jsx
> <Link href={{
>     pathname: `/movies/${movie.id}`,
>     query: {
>         title: movie.originmal_title,
>     },
> }}
> as={`/movies/${movie.id}`}></Link>
> ```

