# SCSS에서 @mixin vs @extend

- SCSS에서 `@mixin`과 `@extend`이 비슷한 것 같아서, 둘을 정확히 언제 써야 할 지 찾아봤다.
- `display: flex`를 자동으로 해주는 기능은 `@mixin`일까 `@extend`일까?

## @Mixin

- CSS의 함수라고 생각하면 편하다.

```SCSS
@mixin what($word) {
  @if $word == "odd" {
    background-color: purple;
  } @else {
    background-color: yellow;
  }
}
```

- 사용 예시) 인자로 홀, 짝을 넣으면 홀수번째는 보라색, 짝수번째는 노란색으로 나오는 함수

```SCSS
body {
  @include what(odd);
}
```

- 사용은 `@include` 로 할 수 있다.
- 편하긴 한데.. 쓸 일이 많을까? 라는 생각이 들었다.

## @Extend

- 마치 클래스를 extend 하듯, 스타일을 상속받을 수 있다.
- `CSS를 클래스처럼 쓸 수 있다니! 폰트 설정도 하고, flex 설정도 해야지!` 라고 생각했는데……
- `연관성이 있는` 컴포넌트들에 적용하는 거라고 한다.

### 사용하면 안 되는 이유

1. 스타일 순서가 꼬임

   - `@extend`는 컴파일할 때, 상속받은 선택자들을 한 곳으로 모은다.

   ```SCSS
   %brand-font {
       font-family: webfont, sans-serif;
       font-weight: 700;
   }

   ...

   h1 {
       @extend %brand-font;
       font-size: 2em;
   }

   ...

   .btn {
       @extend %brand-font;
       display: inline-block;
       padding: 1em;
   }

   ...

   .promo {
       @extend %brand-font;
       background-color: #BADA55;
       color: #fff;
   }

   ...

   .footer-message {
       @extend %brand-font;
       font-size: 0.75em;
   }
   ```

   - 이렇게 `@extend`로 상속받은 컴포넌트들은...

   ```SCSS
   h1, .btn, .promo, .footer-message {
       font-family: webfont, sans-serif;
       font-weight: 700;
   }

   ...

   h1 {
       font-size: 2em;
   }

   ...

   .btn {
       display: inline-block;
       padding: 1em;
   }

   ...

   .promo {
       background-color: #BADA55;
       color: #fff;
   }

   ...

   .footer-message {
       font-size: 0.75em;
   }
   ```

   - `h1, .btn, .promo, .footer-message` 라니! 한곳에 다 모이게 된다!
   - 그런데 컴파일 된 결과물이잖아! 상관 없는 거 아니야?
     - 저렇게 속성이 꼬여버리면 나중에 작성한 스타일이 적용되는 CSS의 특성 상, 예상치 못한 결과물이 나올 수 있다. 😱
     - 그래서 최대한 사용하지 말거나, 연관 있는 컴포넌트들에만 사용하라는 것.

2. 주객전도, 무한선택자

   ```SCSS
   %bold {
       font-weight: bold;
   }

   ...

   .header--home > .header__tagline {
       @extend %bold;
       color: #333;
       font-style: italic;
   }

   ...

   .btn--warning {
       @extend %bold;
       background-color: red;
       color: white;
   }

   ...

   .alert--error > .alert__text {
       @extend %bold;
       color: red;
   }
   ```

- 이렇게 선택자가 여러 개 있는 곳에 `@extend`를 하면...

  ```SCSS
  .header--home > .header__tagline,
  .btn--warning,
  .alert--error > .alert__text {
      font-weight: bold;
  }

  ...

  .header--home > .header__tagline {
      color: #333;
      font-style: italic;
  }

  ...

  .btn--warning {
      background-color: red;
      color: white;
  }

  ...

  .alert--error > .alert__text {
      color: red;
  }
  ```

- 오히려 `font-weight: bold`를 복붙하는 쪽이 용량이 덜 나오는 상황이 발생할 수 있다.
- 어라? 반복을 줄이려고 사용한 건데, 반복할 때보다 길이가 늘어난다면...?

### 연관 있는 컴포넌트에서 사용하는 게 뭔데?

```SCSS
.btn,
%btn {
    display: inline-block;
    padding: 1em;
}

.btn-positive {
    @extend %btn;
    background-color: green;
    color: white;
}

.btn-negative {
    @extend %btn;
    background-color: red;
    color: white;
}

.btn-neutral {
    @extend %btn;
    background-color: lightgray;
    color: black;
}
```

- 이렇게 똑같은 버튼들이 있고, 색상 등 사소한 설정이 조금씩만 다를 때!
- 연관성이 있고, 수백 줄 떨어진 곳에 코드를 삽입하지도 않기 때문에 완벽한 예시
- 즉, `font-family`나 `flex` 설정 등은 `@extend`보다는 `@mixin`을 써야 한다!

## References

- [[번역] Sass에서 웬만하면 extend 말고 믹스인을 사용하자](https://mytory.net/2016/12/23/when-to-use-extend-when-to-use-a-mixin.html)
- [SASS Guidelines - Extend](https://sass-guidelin.es/ko/#extend)
