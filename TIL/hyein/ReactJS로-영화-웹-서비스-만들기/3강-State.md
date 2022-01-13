# 3강 State

## State

- 기본적으로 데이터가 저장되는 곳
- 기존 vanilla JS에서는 event가 발생하여 변수의 값이 바뀌면, 해당 요소를 재렌더링한다.
- ReactJS에서는 해당 요소 전체가 아닌, 바뀐 부분(변수) UI만 재렌더링한다.
  - Interactive한 서비스를 만드는 데 좋다!

## 컴포넌트/JSX에 변수 추가하기

```javascript
let counter = 0;
const Container = () => (
  <div>
    <h3>Total clicks: {counter}</h3>
    <button onClick={countUp}>Click me</button>
  </div>
);
```

`{}` 안에 변수명, 함수명을 적어주면 된다.

## React에서 State 사용하기

```javascript
const App = () => {
  const data = React.useState();
  console.log(data);
  return (
    <div>
      <h3>Total clicks: 0</h3>
      <button>Click me</button>
    </div>
  );
};
```

`data`를 콘솔에 출력해 보면

```javascript
(2)[(undefined, ƒ)];
```

이런 Array가 return되는데

- 0: 변수
- 1: 변수 값을 변경하는 함수

## 배열 값을 변수에 손쉽게 할당하기

```javascript
const food = ["tomato", "potato"];
// 기존 방법
const tomato = food[0];
const potato = food[1];
// shortcut
const [myFavFood, mySecondFavFood] = food;
console.log(myFavFood) = "tomato";
```

## 변수를 직접 바꾸면 되지, 왜 굳이 함수로 값을 변경해야 하나요?

```javascript
const [counter, setCounter] = React.useState(0);
modifier(3000);
```

- `setCounter` 함수를 사용하면 `setCounter` 변수의 값을 변경함과 동시에 재렌더링을 한다.
  - 재랜더링: 컴포넌트가 새로 만들어짐. 그러나 전체를 다 바꾸는 건 아니고 필요한 부분만 변경됨
- 보통 `set + 변수이름`으로 함수명을 작성함

## State를 설정하는 법

1. 직접 state의 값을 변경

```javascript
setCounter(counter + 1);
```

- 변수의 값을 직접 변경하기 때문에, 예상치 못한 다른 곳에서 변수가 변경되었다면 생각하는 값이 나오지 않을 수도 있다.

2. 함수를 전달해서 state의 값을 변경

```javascript
setCounter((current) => current + 1);
```

- setCounter 함수는 언제나 현재 state의 값을 인자로 전달하므로 현재 state에서 계산한 값이 예상대로 나온다.
- 이쪽이 더 안전하니까 이 방법을 쓰자!

## ReactJS의 production, development 모드

ReactJS에는 2가지 버전이 있음.

- production

```html
<script src="https://unpkg.com/react@17.0.2/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
```

- development

```html
<script src="https://unpkg.com/react@17.0.2/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js"></script>
```

- development 모드에서는 `for`, `class`처럼 javascript 예약어를 사용하면 오류를 띄워준다.
- `class` -> `className`
- `for` -> `htmlFor`

## JSX에서는 html이랑 js를 섞어서 쓸 수 있다!

```javascript
// Component 중 일부
return (
  <div>
    <label htmlFor="hours">Hours</label>
    <input
      value={flipped ? amount : Math.round(amount / 60)}
      id="hours"
      placeholder="Hours"
      type="number"
      onChange={onChange}
      disabled={!flipped}
    />
  </div>
);
```

`{}` 안에는 JavaScript 코드를 적을 수 있어!
Super Awesome..
