# Redux Fundamentals

## Redux

- 애플리케이션의 `global state`를 관리하기 위한 `library`

## Redux, 언제 쓰면 좋을까?

- 애플리케이션의 여러 부분에서 사용되는 많은 양의 state
- 애플리케이션의 state가 자주 update 될 때
- state를 update하는 로직이 복잡할 때
- 많은 사람들이 개발하는 중간 이상의 규모를 가진 애플리케이션

## Redux Store

- 애플리케이션의 `global state`를 저장하는 컨테이너
- `Redux store`에 저장된 `state`는 직접적으로 수정하면 안 됨
- 그럼 어떻게 수정하나요?
  - `action`: `state`를 update하는 트리거 (`EventListner`처럼) / action을 dispatch하면 store가 update 된다.
  - action이 dispatched 되면, store는 `root reducer`를 실행하고, `root reducer`는 현재 state를 기준으로 state를 계산해준다.
  - 작업이 끝나면 store는 `subscribers`에게 state가 갱신되었으니 UI를 update 해달라고 알려준다.

## Action, Reducers, store

- `action`: `type` 필드를 가진 javascript object. 애플리케이션에 `무슨 일이` 일어났는지 알려준다.
- `reducers`: 이전 state + action을 가지고 새 state를 계산하는 `함수`
- `store`: action이 dispatch 될 때마다 root reducer를 실행한다.

## Data flow

![Data-flow](https://redux.js.org/assets/images/one-way-data-flow-04fe46332c1ccb3497ecb04b94e55b97.png)

- `state`는 애플리케이션의 특정 상황의 상태를 나타낸다.
- `UI`는 state를 기반으로 렌더링된다.
- 유저가 버튼을 누르는 등 어떤 일이 일어나면, state는 해당 action대로 update된다.
- UI가 새 state를 기반으로 다시 렌더링된다.
- 좋아.. 알겠어! 그런데... `하나의 state를 여러 컴포넌트에서 사용할 때`는 이러한 data flow가 제대로 동작하지 않을 수 있다.

## Immutability

- mutable: `changable`. object나 array처럼 값을 바꿀 수 있는 형태. (Reference로 불리는 자료형)
- immutable: number, string 등의 primitive한 자료형.
- redux는 object/array 등의 mutable한 자료형의 immutability를 지키기 위해 `직접 state를 수정하지 않고`, `항상 원본을 copy한 뒤, copy를 수정한다.` (ES6 스프레드 연산자 사용)

## Actions

- type 필드를 가진 Javascript object.
- type은 action을 설명하는 이름이 되어야 함.
  - `todos/todoAdded`, 주로 `domain/eventName`
- payload: action에 추가 설명

```javascript
const addTodoAction = {
  type: "todos/todoAdded",
  payload: "Buy milk",
};
```

## Reducers

- 현재 state, action을 인자로 받아 새 state를 계산하는 함수 `(state, action) => newState`
- `Arrays.reduce()`와 동작 방식이 유사하여 `reducer`라는 이름이 붙었음

### reducer 규칙

- state, action을 사용하여 새 state 값 계산만을 수행해야 함
- 현재 state를 수정하면 안 됨. copy를 통한 `immutable update` 수정 후, copy의 값을 변경해야 함
- 예상치 못한 동작을 부르는 asynchronous logic, 랜덤 값 계산 등은 수행하면 안 됨

## Store

- state를 저장하는 객체
- `reducer`를 패스하면서 만들 수 있고, `getState()`로 현재 값을 알 수 있음

```javascript
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: counterReducer });

console.log(store.getState());
// {value: 0}
```

## Dispatch

- redux store가 가진 메소드
- state를 update 하려면 반드시 `store.dispatch()`를 불러야 함
- `dispatch` 호출 -> state 값 변경 -> `getState` 호출 -> 변경된 state의 값을 얻어옴

## Selectors

- `getState()`를 호출하면 state에 저장된 모든 값이 반환됨
- 만약 애플리케이션이 엄청 커진다면, 한번의 `getState()` 호출로 돌아오는 값이 엄청 많아지겠지?
- 이럴 때 내가 필요한 state만 딱 찝어서 반환하는 함수를 `selector`라고 한다.

```javascript
const selectCounterValue = (state) => state.value;

const currentValue = selectCounterValue(store.getState());
console.log(currentValue);
// 2
```

## Core Concepts & Principles

- Single Source of Truth
  - 애플리케이션의 global state => 하나의 store에 저장된 object
  - 데이터는 여러 곳이 아닌, 반드시 한 곳에 존재해야 한다!
  - 그러나 모든 state가 store에 저장되어야 한다는 뜻은 아님! 재사용되지 않는 state라면 store에 저장할 필요는 없다.
- Read-Only State
  - `action`이 dispatch 될 때만 state가 변경된다.
  - 이렇게 하면 UI가 데이터 변경을 감지 & 추적 & 재렌더링하기 쉬워져!
  - action은 JS Object이므로, 로깅, 시리얼라이즈, 저장, 디버깅, 테스팅 등 다양하게 사용될 수 있음
- Pure Reducer Functions를 사용한 Change
  - action을 기반으로 reducer 함수를 작성해서 state의 값을 변경하자!
  - 물론 함수이므로 더 잘게 쪼개도 됨

## Data flow 자세하게

- 초기 setup
  - `root reducer function`을 실행하여 `Redux store`를 만든다.
  - root reducer를 호출하여 initial state를 반환받아, state를 초기화
  - UI가 처음 렌더링될 때는 이 초기 store 값으로 렌더링된다.
- updates
  - 유저가 버튼을 누르는 등 애플리케이션에 변화가 일어난다.
  - 애플리케이션은 해당 action을 dispatch한다. `dispatch({type: 'counter/incremented'})`
  - store는 현재 state, action을 인자로 reducer function을 호출하고, 새 state를 계산한다.
  - store는 모든 UI에게 state가 update 되었다고 알려준다.
  - 각 UI 컴포넌트는 자신의 state가 변경되었는지 확인한다.
  - 변경되었으면 재렌더링되고, 새 데이터가 화면에 나타난다.

## Reducers의 분리, Combine Reducers

- root reducer는 1개!
- 보통 reducer들은 각 action을 if~else, switch 등으로 분류하여 작성됨
- 그런데 action 수가 많아지면 함수 길이는....??
- 그래서 페이지, 기능별로 reducer를 분리하고 `combineReducers()`로 각 reducer들을 합친다.

## References

- [Redux Fundamentals, Part 1: Redux Overview](https://redux.js.org/tutorials/fundamentals/part-1-overview)
- [Redux Fundamentals, Part 2: Concepts and Data Flow](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow)
- [Redux Fundamentals, Part 3: State, Actions, and Reducers](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers)
