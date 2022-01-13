# 6강 Effects

## Effects, 언제 필요할까?

- state가 변화할 때 component가 재렌더링되고, 모든 코드가 다시 실행된다.
- 그런데.. `첫 번째 component render에서만 실행되는 코드`가 필요해!
- 예) API 호출 등..

## useEffect: Effect 사용하기

1. `useEffect` import

```javascript
import { useEffect } from "react";
```

2. 어떤 함수인가?

```javascript
(alias) function useEffect(effect: EffectCallback, deps?: DependencyList): void
import useEffect
Accepts a function that contains imperative, possibly effectful code.

@param effect — Imperative function that can return a cleanup function

@param deps — If present, effect will only activate if the values in the list change.

@version — 16.8.0

@see — https://reactjs.org/docs/hooks-reference.html#useeffect
```

- `effect`: 초기 한 번만 실행되었으면 하는 callback 함수
  - 컴포넌트가 재렌더링(=생성) 될때마다 불리니까, 꼭 `Vue.js`의 `created()` 함수 같구나!
  - 이 callback 함수의 return문은 컴포넌트가 삭제될 때, 즉 `Vue.js`의 `destroyed` 함수와 같은 역할을 한다.
- `deps`: React가 변화를 감지할 value들의 Array (dependencies)
  - `[]`: 초기 한 번만 변화를 감지함
  - `[keyword]`: `keyword`라는 변수가 변화할 때 callback 함수가 실행됨
