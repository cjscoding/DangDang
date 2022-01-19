# [Redux](https://youtube.com/playlist?list=PLuHgQVnccGMDuVdsGtH1_452MtRxALb_7)

## Redux

- Javascript app을 위한 예측 가능한 상태 컨테이너
- React 외에서도 사용할 수 있지만, React에서 많이 쓴다.

## Why Redux?

- React에서 상태를 전달하려면 `props`로 전달해야 했었다.
- 부모-자식 간이면 괜찮지만, 서로 관계 없는 컴포넌트들이 같은 데이터를 사용하려면, 둘을 거치는 모든 컴포넌트에 계속 `props` 전달을 해 줘야 한다.
- `props`가 변화하면, React 컴포넌트는 렌더링된다!
- 쓸데없는 렌더링이 많아지니 성능이 떨어지겠지?
- 그리고 앱의 규모가 클 수록 `props`를 전달하면서 꼬일 가능성도 매우 커짐!
- `React에 기지국을 세우자!` 언제 어디서나 접근 가능한 상태 관리를 `Redux`가 가능하게 해 준다.
- `시간 여행 디버깅`: state가 변하는 순간을 모두 추적 가능하다!

## Redux 설치하기

- 설치

```
npm install redux
```

- 사용법 - `src/store.js`을 만들고 `import { createStore } from "redux";`하여 사용한다.

```javascript
export default createStore(function (state, action) {
    return state;

// Redux Devtools 사용설정
// Chrome 애플리케이션을 깔고 아래 줄을 store에 추가
}, window.**REDUX_DEVTOOLS_EXTENSION** &&
window.**REDUX_DEVTOOLS_EXTENSION**());

```

- `state`: 우리가 store에서 관리할 data의 object
- `action`: state들이 input, update 등의 트리거로 발생하는 이벤트

## Redux Wrapper

- Redux를 사용해서 상태관리 하는 것까지는 참 좋아! 그런데...
- 컴포넌트에 Redux를 쓰면 항상 Redux store의 값을 쓰고 있기 때문에, 다른 곳에 쓰지 못하는 `Redux에게 종속적인 컴포넌트`가 된다.
- Redux 종속성을 해제하기 위해, `container div`처럼 `Redux Wrapper`를 만들어준다.
- 기존 컴포넌트를 감싸는 Wrapper 컴포넌트에서 `Redux store`에 접근하고, 실제로 데이터를 표시, 입력받는 기존 컴포넌트는 `Redux store`가 아닌 `props`에서 전달받는다.
- Redux에 종속된다고 해서, 무조건 나쁜 건 아님! 자기가 만드는 서비스에 무엇이 필요한지 잘 고민해 보자.

## `Connect` 함수의 동작, `mapStateToProps`, `mapDispatchToProps`

```javascript
// store.js
// 1. Wrap할 컴포넌트와 connect를 import
import Component from "../components/AddNumber";
import { connect } from "react-redux";

export default connect()(Component);
```

- 이렇게만 쓰면 `connect()()`가 알아서 `Component`를 Wrap해 준다고...?!
- 마법같은 `connect` 함수에 대해 좀 더 알아보자!
- 다음은 `connect` 함수의 간단한 구현체이다.

```javascript
// connect 함수는 함수 2개로 되어 있다. (connect())() 이렇게.
function connect(mapStateToProps, mapDispatchToProps) {
  // 첫번째 함수: 그저 Wrap할 Component를 인자로 받는 함수를 반환한다.
  return function (WrappedComponent) {
    // 두번째 함수: Component에 인자로 넘겨진 props, mapStateToProps, mapDispatchToProps를 넣어서 반환해준다.
    return class extends React.Component {
      render() {
        return (
          <WrappedComponent
            {...this.props}
            {...mapStateToProps(store.getState(), this.props)}
            {...mapDispatchToProps(store.dispatch, this.props)}
          />
        );
      }

      // Mount 되었을 때 render() 함수를 호출하게 함
      componentDidMount() {
        this.unsubscribe = store.subscribe(this.handleChange.bind(this));
      }

      // Unmount 되었을 때는 해제해준다.
      componentWillUnmount() {
        this.unsubscribe();
      }

      handleChange() {
        this.forceUpdate();
      }
    };
  };
}

// 인자로 들어온 함수(mapStateToProps, mapDispatchToProps)가 각각 Redux의 state, dispatch를 인자로 가지고 있음.
const ConnectedCounter = connect(
  (state) => ({
    value: state.counter,
  }),
  (dispatch) => ({
    onIncrement() {
      dispatch({ type: "INCREMENT" });
    },
  })
)(Counter);
```

- 첫번째 인자 `mapStateToProps`: `Redux State`를 `React Props`로 바꿔주는 함수. `state`를 인자로 가짐.

```javascript
function mapStateToProps(state) {
  return {
    number: state.number,
  };
}
```

- 두번째 인자 `mapDispatchToProps`: `Redux Dispatch`를 `React Props`로 바꿔주는 함수. `dispatch`를 인자로 가짐.

```javascript
function mapDispatchToProps(dispatch) {
  return {
    onClick: function (size) {
      dispatch({ type: "INCREMENT", size: size });
    },
  };
}
```

# References

- [생활코딩 - React Redux](https://youtube.com/playlist?list=PLuHgQVnccGMDuVdsGtH1_452MtRxALb_7)
- [connect.js explain- React redux](https://gist.github.com/gaearon/1d19088790e70ac32ea636c025ba424e)
