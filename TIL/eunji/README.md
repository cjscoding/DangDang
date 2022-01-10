# TIL
------------
## 2022.01.10
# 3강 필드와 컬럼 매핑

DDL을 애플리케이션 실행 시점에 자동 생성

테이블 중심에서 객체 중심으로 

데이터베이스 방언을 활용해 데이터베이스에 맞는 적절한 DDL 생성

**이렇게 생성된 DDL은 개발 장비에서만 사용**

자동 스키마 생성

creat,create-drop validate, none, update

알아서 스키마 생성해줌

create는 원래 있던 table drop하고 생성해줌

매핑 어노테이션

→ 철저하게 테이블과의 매핑에서만 사용

**EnumType은 무조건 String으로 해야한다.**

```java
@Enumerated(EnumType.STRING)
	private MemberType memberType;
```

@Column

자바 코드에서는 name이라고 쓰지만 테이블에선 USERNAME이라고 쓰겠다.

```java
@Column(name="USERNAME")
	private String name;
```

Lob : 컨텐츠의 길이가 길 때

CLOB :  string

BLOB :  byte

@Transient

이 필드는 매핑하지 않는다. 애플리케이션에서 DB에 저장하지 않는 필드

## 식별자 매핑

@Id

auto increment와 같은걸 사용할 수 있음

직접 set으로 아이디값 넣지 않아도 됨

```java
@Id @GeneratedValue(strategy = GenerationType.AUTO)
private Long id;
```

권장하는 식별자 전략

기본 키 제약 조건 : null 아님, 유일, 변하면 안된다.

미래까지 이 조건을 만족하는 자연키는 찾기 어렵다. 대리키(대체키)를 사용하자.

권장 : Long + 대체키 + 키 생성전략 사용

비지니스와 전혀 관계없는 걸로 키를 사용해라!

auto increment하면 int 쓰지마라
