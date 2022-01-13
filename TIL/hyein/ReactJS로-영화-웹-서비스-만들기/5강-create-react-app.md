# create-react-app

## create-react-app으로 프로젝트 만들기

```bash
$ npx create-react-app <my-app>
cd <my-app>
npm start
```

- 종료는 `Ctrl + C`

- `create-react-app`을 사용하면, 컴포넌트들을 독립된 파일로 만들 수 있어!

## CSS 모듈화하기

- `xxx.module.css`라고 파일명을 지은 뒤, 사용하려는 컴포넌트에 import 해주면 CSS를 모듈화할 수 있다.

```css
// Button.module.css
.btn {
  color: white;
  background-color: tomato;
}
```

- CSS에서 클래스를 선언해주고

```javascript
import styles from "./Button.module.css";

function Button({ text }) {
  return <button className={styles.btn}>{text}</button>;
}
export default Button;
```

- 컴포넌트에서 클래스명으로 접근하면 CSS가 적용된다.
- 실제 클래스명은 `btn`이 아니라 랜덤 클래스명이 된다.
  - 똑같은 클래스명을 써도 모듈이 다르면 중복되지 않아!
