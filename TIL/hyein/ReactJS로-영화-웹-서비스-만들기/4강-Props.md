# 4강 props

## Components

- JSX를 반환하는 함수

## Props

- 부모 컴포넌트로부터 자식 컴포넌트에 데이터를 보낼 수 있게 해주는 방법

## Props를 사용해보자!

1. Component에 props 인자를 준다

```javascript
function Btn(props) {
  console.log(props);
  return <button>Button</button>;
}
```

- 인자 `props`는 `Object`이다. 여기에 props로 전달된 데이터들이 key-value 쌍으로 넘어올거야!

2. 부모 컴포넌트에서 props 보내기

```javascript
function App() {
  return (
    <div>
      <Btn text="Save Changes" />
      <Btn text="Continue" />
    </div>
  );
}
```

- `<img src="~~~" />`같은 html처럼, 간단하게 props를 보낼 수 있다.
- props는 `{ "text" : "Save Changes" }`의 `Object`로 전달됨

3. 자식 컴포넌트에서 사용하기

- `Object`니까 `{props.text}` 처럼 사용할 수 있겠지?

```javascript
function Btn(props) {
  console.log(props);
  return <button>{props.text}}</button>;
}
```

## 맨날 `props.` 하기 귀찮은데요? 쉬운 방법은 없을까요?

```javascript
function Btn({ text }) {
  console.log(props);
  return <button>{text}</button>;
}
```

- 와~~ 편하다!

## Props로 함수도 전달할 수 있다

```javascript
function App() {
  const [value, setValue] = React.useState("Save Changes");
  const changeValue = () => setValue("Revert Changes");
  // onClick is not an event listener, just prop
  return (
    <div>
      <Btn text="{value}" onClick={changeValue} />
      <Btn text="Continue" />
    </div>
  );
}
```

- 단, 여기서 전달하는 `onclick`은 Event Listener가 아님.
- `{"onclick" : function}`인 속성 이름일 뿐임
- props로 전달된 함수를 사용하려면, 자식 컴포넌트에서 props를 사용해줘야 함.

```javascript
function Btn({ text, onClick }) {
  return (
    // props로 전달된 onClick을 사용하면 이제 event listener가 된다.
    <button onClick={onClick}>{text}</button>
  );
}
```

## 재렌더링 멈춰~~! React Memo 기능

- React는 props가 변경되면 state가 변경되니까, 컴포넌트를 재렌더링하게 됨
- 하지만 그 중에는 내용이 변경되지 않는 컴포넌트도 존재
- 바뀌지 않는 컴포넌트를 매번 재렌더링하는 건 비효율적임 -> `React Memo` 기능 사용

```javascript
const MemorizedBtn = React.memo(Btn);
function App() {
  const [value, setValue] = React.useState("Save Changes");
  const changeValue = () => setValue("Revert Changes");
  // onClick is not an event listener, just prop
  return (
    <div>
      <MemorizedBtn text={value} onClick={changeValue} />
      <MemorizedBtn text="Continue" />
    </div>
  );
}
```

- 컴포넌트를 메모하면, 변경되지 않는 컴포넌트는 재렌더링하지 않아!

## Props 타입 명시하기: PropTypes

- props를 넘기는 것까진 좋아! 그런데...
- 나는 `Number`만 들어왔으면 좋겠는데, 부모 쪽에서 `String`을 보내면 어떡해?
- 이런 경우를 대비해 props에 type을 명시할 때 사용한다.

1. 설치 방법

```html
<script src="https://unpkg.com/prop-types@15.7.2/prop-types.js"></script>
```

- React가 `production.js` 모드일 때는 작동하지 않음! `development.js` 필수

2. PropTypes 정의

```javascript
Btn.propTypes = {
  text: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
};
```

- array, string, number, object... 검사하고 싶은 type을 넣어주자.
- `isRequired` 옵션은 필수로 전달해야 하는 props일 때 넣어준다.

## Props default 값 설정

```javascript
function Btn({ text = "My Button" }) {
  console.log(props);
  return <button>{text}</button>;
}
```

- 놀라운 게 아니라 그냥 Javascript 문법이라고 한다..
