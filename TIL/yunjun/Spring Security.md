# Spring Security

# 1. DelegatingFilterProxy & FilterChainProxy

## DelegatingFilterProxy

Servlet Filter

요청을 Dispatcher Servelt으로 넘기기 전에 먼저 받아서, 특정한 처리를 함

스프링에서 정의된 빈을 주입해서 사용할 수 없음

Filter에서 스프링 빈을 이용한 기능이 필요하게 됨 → 특정한 이름을 가진 스프링 빈을 찾아 그 빈에게 요청을 위임

- springSecurityFIlterChain 이름으로 생성된 빈을 ApplicationContext에서 찾아 요청을 위임
- 실제 보안처리를 하지 않음

이러한 요청을 만족하기 위해 만들어 진것이 **DelegatingFilterProxy**

## FilterChainProxy

- springSecurityFilterChain 의 이름으로 생성되는 필터 빈
- DelegatingFilterProxy 으로 부터 요청을 위임 받고 실제 보안 처리
- 스프링 시큐리티 초기화 시 생성되는 필터들을 관리하고 제어
- 스프링 시큐리티가 기본적으로 생성하는 필터
- 설정 클래스에서 API 추가 시 생성되는 필터
- 사용자의 요청을 필터 순서대로 호출하여 전달
- 사용자정의 필터를 생성해서 기존의 필터 전 후로 추가 가능
- 필터의 순서를 잘 정의
- 마지막 필터까지 인증 및 인가 예외가 발생하지 않으면 보안 통과

# 2. 필터 초기화와 다중 설정 클래스

SecurityConfig를 여러개 만들어서 다중 설정하는 경우

ex) 2개의 SecurityConfig를 생성하는 경우

설정 클래스 별로 필터가 생성됨 → FiterChainProxy가 2개의 필터를 모두 가지고 있다가 요청에 따라 RequestMatcher와 매칭되는 필터가 작동되도록 함

@Order 어노테이션으로 초기화 순서를 배정할 수 있다

# 3. Authentication

- 사용자의 인정 정보를 저장하는 토큰 개념
- 인증 시 id 와 password 를 담고 인증 검증을 위해 전달되어사용된다
- 인증 후 최종 인증 결과 user 객체 , 권한정보 를 담 고 SecurityContext 에 저장되어 전역적으로 참조가 가능하다

```java
Authentication authentication = SecurityContexHolder.getContext().getAuthentication()
```

- 구조
    - principal : 사용자 아이디 혹은 User 객체를 저장
    - credentials : 사용자 비밀번호
    - authorities : 인증된 사용자의 권한 목록
    - details : 인증 부가 정보
    - Authenticated : 인증 여부

# 4. SecurityContextHolder, SecurityContext

## SecurityContext

- Authentication 객체가 저장되는 보관소로 필요 시 언제든지 Authentication 객체를 꺼내어 쓸 수 있도록 제공되는 클래스
- ThreadLocal 에 저장되어 아무 곳에서나 참조가 가능하도록 설계함
- 인증이 완료되면 HttpSession 에 저장되어 어플리케이션 전반에 걸쳐 전역적인 참조가 가능하다

## SecurityContextHolder

- SecurityContext 객체 저장 방식
    - MODE_THREADLOCAL : 스레드당 SecurityContext 객체를 할당 , 기본값
    - MODE_INHERITABLETHREADLOCAL : 메인 스레드와 자식 스레드에 관하여 동일한 SecurityContext 를 유지
    - MODE_GLOBAL : 응용 프로그램에서 단 하나의 SecurityContext 를 저장한다
- SecurityContextHolder.clearContext() : SecurityContext 기존 정보 초기화

```java
Authentication authentication = SecurityContextHolder.getContext().getAuthentication()
```

# 5. SecurityContextPersistenceFilter

## SecurityContext 객체의 생성 , 저장 , 조회

### 익명 사용자

- 새로운 SecurityContext 객체를 생성하여 SecurityContextHolder 에 저장
- AnonymousAuthenticationFilter 에서 AnonymousAuthenticationToken 객체를 SecurityContext 에 저장

### 인증 시

- 새로운 SecurityContext 객체를 생성하여 SecurityContextHolder 에 저장
- UsernamePasswordAuthenticationFilter 에서 인증 성공 후 SecurityContext 에 UsernamePasswordAuthentication 객체를 SecurityContext 에 저장
- 인증이 최종 완료되면 Session 에 SecurityContext 를 저장

### 인증 후

- Session 에서 SecurityContext 꺼내어 SecurityContextHolder 에서 저장
- SecurityContext 안에 Authentication 객체가 존재하면 계속 인증을 유지한다

### 최종 응답 시 공통

```java
SecurityContextHolder.clearContext()
```

## 6. AuthenticationManager

- AuthenticationProvider 목록 중에서 인증 처리 요건에 맞는 AuthenticationProvider 를 찾아 인증처리를 위임한다
- 부모 ProviderManager 를 설정하여 AuthenticationProvider 를 계속 탐색 할 수 있다