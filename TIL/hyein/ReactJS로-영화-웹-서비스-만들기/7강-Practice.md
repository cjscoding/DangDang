# 7강 Practice

## state를 직접 변경하지 않고도 배열에 push 하기

```javascript
setToDos((currentArray) => [...currentArray, toDo]);
```

- ... 문법을 사용하면 아주 간단하게 기존 배열의 원소들을 새 배열에 담을 수 있다.

## map() 함수 사용하기

```javascript
method) Array<any>.map<JSX.Element>(callbackfn: (value: any, index: number, array: any[]) => JSX.Element, thisArg?: any): JSX.Element[]
Calls a defined callback function on each element of an array, and returns an array that contains the results.

@param callbackfn — A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.

@param thisArg — An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
```

- 배열의 `map` 함수는 인자로 callback 함수를 받는다.
- 각 원소마다 콜백 함수가 실행되고, return값들이 담긴 새 array를 반환한다.
- 두 번째 인자는 `index`이다.
- 원본 배열의 결과는 바뀌지 않는다!

```javascript
toDos.map((item, index) => <li key={index}>{item}</li>);
```

- 각 배열 원소를 list로, index를 key로 반환하여 To Do List를 만들었다.

## React Router

- React에서 (새로고침 없이) 다른 페이지로 이동할 수 있게 해주는 도구
- URL을 보고 있는 Component

### 설치

```bash
npm install react-router-dom
```

- 강의는 `5.3.0` 버전인데 현재 react-router-dom은 `6.2.1` 버전이다.
  따라서 기존의

```javascript
<Router>
  <Switch>
    <Route path="/">
      <Home />
    </Route>
    <Route path="/movie">
      <Detail />
    </Route>
  </Switch>
</Router>
```

방식을

```javascript
<Router>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/movie" element={<Detail />} />
  </Routes>
</Router>
```

이렇게 변경해주어야만 했다.

### 라우터 연결

```javascript
<Link to="/movies">{title}</Link>
```

- `Link` 컴포넌트를 사용하여 연결한다.

## React Router - Dynamic URL

```javascript
<Router>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/movie/:id" element={<Detail />} />
  </Routes>
</Router>
```

이렇게 동적으로 변할 항목을 `/:value`로 작성한 뒤

```javascript
<Link to={`/movie/${id}`}>{title}</Link>
```

`Link` 컴포넌트에 변수를 props로 보내 준다.

## React hook useeffect has a missing dependency 오류 해결

- 강의를 따라했는데 `React hook useeffect has a missing dependency` 오류가 떴다.
- 실행은 잘 되는데 거슬려서 해결해보기로 함

### 문제 상황

```javascript
const getMovie = async () => {
  const json = await (
    await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
  ).json();
  console.log(json.data);
  setMovie(json.data.movie);
};
useEffect(() => {
  getMovie();
}, []);
```

- `useEffect()` 함수 안에 미리 정의한 `getMovie()` 함수를 호출했는데, `getMovie()` 함수는 `id`라는 값이 필요해서 경고가 나타났다.

### 해결법

```javascript
const getMovie = useCallback(async () => {
  const json = await (
    await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
  ).json();
}, [id]);

useEffect(() => {
  getMovie();
}, [getMovie]);
```

- `useCallback`이 없다면, 컴포넌트가 재렌더링될 때마다 계속해서 `getMovie` 함수를 만들고, 새로운 참조값을 받아서 무한 함수실행을 하게 된다.
- `useCallback`을 정의함으로써, `id`가 바뀔 때만 `getMovie`가 실행되어, 불필요한 함수 실행을 막을 수 있다.

```javascript
import { useCallback } from "react";
```

- `useCallback`을 사용하려면 import를 먼저 해 줘야 한다!
