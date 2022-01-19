# [React-Redux(생활코딩)](https://www.youtube.com/watch?v=fkNdsUVBksw&list=PLuHgQVnccGMDuVdsGtH1_452MtRxALb_7)

## SET UP

```
(terminal)
npm install react-redux
```

## store

- 기존 방식

```javascript
//모든 컴포넌트에
import store from "./store";
```

> 모든 컴포넌트 각각의 파일에서 store를 import해야 사용가능하다.

- react-redux

```javascript
//index.js
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

> Provider : react-redux에서 제공하는 App의 상위 컴포넌트  
- Provider가 App을 싸고 있으면 App에 속해있는 모든 컴포넌트가 store를 사용할 수 있게 된다.

## mapStateToProps
```javascript
export default connect(mapStateToProps, mapDispatchToProps)(component);
```