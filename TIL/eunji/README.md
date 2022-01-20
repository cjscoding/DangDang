# TIL
------------
### 2022.01.10
## 3강 필드와 컬럼 매핑

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

--------
### 2022.01.11
## 2강 JPA 기본기 다지기

객체 매핑하기 

@Entity : JPA가 관리할 객체 엔티티라는 뜻

@Id : DB PK와 매핑할 필드

persistence.xml 이 필요

JPA 설정 파일

/META-INF/persistence.xml 위치 

db 접속정보, 옵션정보들 넣어줌

드라이버 아이디 비밀번호 url 

hibernate.dialect → hibernate에서만 사용 가능 / 데이터 베이스 방언

JPA는 특정 db에 종속적이지 않은 기술

각각의 db가 제공하는 SQL 문법과 함수는 조금씩 다르다 

방언 : SQL 표준을 지키지 않거나 특정 db만의 고유한 기능

테이블 생성

```sql
create table Member(
id bigint not null,
name varchar(20),
primary key(id)
);

select * from Member;
```

dependency 추가

```xml
<dependencies>
		<!-- https://mvnrepository.com/artifact/org.hibernate/hibernate-core -->
		<dependency>
			<groupId>org.hibernate</groupId>
			<artifactId>hibernate-entitymanager</artifactId>
			<version>5.3.7.Final</version>
		</dependency>

		<!-- https://mvnrepository.com/artifact/com.h2database/h2 -->
		<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<version>1.4.200</version>
			<scope>test</scope>
		</dependency>

		<!-- 오류 뜨면 추가해줌-->
		<dependency>
			<groupId>javax.transaction</groupId>
			<artifactId>jta</artifactId>
			<version>1.1</version>
		</dependency>

	</dependencies>
```

Member entity 만들기

```java
package hellojpa.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Member {
	@Id
	private Long id;
	private String name;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
}
```

META-INF에 persistence.xml 만들기

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence version="2.2"
             xmlns="http://xmlns.jcp.org/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd">
    <persistence-unit name="hello">
        <properties>
            <!-- 필수 속성 -->
            <property name="javax.persistence.jdbc.driver" value="org.h2.Driver"/>
            <property name="javax.persistence.jdbc.user" value="sa"/>
            <property name="javax.persistence.jdbc.password" value=""/>
            <property name="javax.persistence.jdbc.url" value="jdbc:h2:tcp://localhost/~/test"/>
            <property name="hibernate.dialect" value="org.hibernate.dialect.H2Dialect"/>
            <!-- 옵션 -->
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
            <property name="hibernate.use_sql_comments" value="true"/>
            <!--<property name="hibernate.hbm2ddl.auto" value="create" />-->
        </properties>
    </persistence-unit>
</persistence>
```

오류 뜨면 2.2 → 2.1 버전으로 바꿔줌

h2 jar파일 추가해주기 

insert 사용해보기

```java
package hellojpa;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

import hellojpa.entity.Member;

public class Main {
	public static void main(String[] args) {
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
		EntityManager em = emf.createEntityManager();
		EntityTransaction tx = em.getTransaction();
		tx.begin();

		try {
			Member member = new Member();
			member.setId(200L);
			member.setName("이름");
			em.persist(member);

			tx.commit();
		} catch (Exception e) {
			tx.rollback();
		} finally {
			em.close();
		}

		System.out.println("hello");
		emf.close();
	}
}
```

엔티티 매니저 팩토리는 하나만 생성해 애플리케이션 전체에서 공유

엔티티 매니저는 쓰레드간에 공유하면 안된다. (사용하고 버려야 함)

JPA의 모든 데이터 변경은 트랜잭션 안에서 실행

------------
### 2022.01.12
## 5강 양방향 매핑

[[토크ON세미나] JPA 프로그래밍 기본기 다지기 5강 - 양방향 매핑 | T아카데미](https://youtu.be/0zTtkIYMOIw)

### mappedBy

왜 써야하는걸까? 

객체와 테이블간의 연관관계를 맺는 차이에 대해 이해해보자

Member 테이블에서는 Team team으로 연결 될 수 있고,

Team 테이블에서는 List member로 연결될 수 있는 두가지 방향이 있다.

테이블은 teamId 하나만 쓴다.

### 객체 연관관계

회원 → 팀 연관관계 1개

팀 → 회원 연관관계 1개 

### 테이블 연관관계

회원 ↔ 팀의 연관관계 1개 (양방향)

이 차이의 극복을 어떻게 하냐~

**객체의 양방향 관계는 사실 양방향 관계가 아니라 서로 다른 단방향 관계 2개이다.** 

객체를 양방향으로 참조하려면 단방향 연관관계 2개를 만들어야 한다.

테이블은 외래키 하나로 두 테이블의 연관관계를 관리

Member.setTeam 이나 Team.setMembers를 하던 둘다 가능해야한다. 

둘중에 하나만 해도 Member, Team 둘다 값이 업데이트 되어야 함

둘 중에 한놈을 주인으로 만들고, 한놈은 읽기만 가능하게 만들자!

Team team or List member 둘중에 하나만 값을 업데이트 할 수 있다.

### 연관관계의 주인(Owner)

mappedBy를 사용하는 곳은 주인이 아님

주인이 아닌 쪽은 읽기만 가능

그래서 둘중에 누가 주인이 되어야함?

외래 키가 있는 곳을 주인으로 정해라.


주인에 값을 넣지 않을 경우 null 값이 들어감 

```java
//			member.setTeam(team); //team 객체 Member에 넣기주석
			team.getMembers().add(member);
```

Member에 team을 넣지 않고, team에 setMembers를 했을 경우 null이 들어감. (주인에 값 넣지 않음)

그냥 두군데 다 값을 넣어버려라 

양방향 매핑의 장점

- 단방향 매핑만으로도 이미 연관관계 매핑은 완료됨
- 반대 반향으로의 조회 기능이 추가된 것 뿐
- 현업에서 많이 씀
- JPQL에서 역방향으로 탐색할 일이 많아서
- 단방향 매핑을 잘 하고, 양방향은 필요할 때만 추가해도 됨~

### 연관관계 매핑 어노테이션

- @ManyToOne (현업에서는 잘 안씀)
- @OneToMany
- @OneToOne
- @ManyToMany
- @JoinColumn, @JoinTable

### 상속 관계 매핑 어노테이션

- Inheritance
- DiscriminatorColumn
- DiscriminatorValue
- MappedSuperclass (매핑 속성만 상속)

### 복합 키 어노테이션

- IdClass
- Embeddedld
- Embeddable
- Mapsld

------------
### 2022.01.13
## 6강 JPA 내부구조

[[토크ON세미나] JPA 프로그래밍 기본기 다지기 6강 - JPA 내부구조 | T아카데미](https://youtu.be/PMNSeD25Qko)

## JPA에서 가장 중요한 2가지

1. 영속성
2. 컨텍스트

유저의 요청이 올 때마다 EntityManager를 별도로 생성해야 함 

### 영속성 컨텍스트

엔티티를 영구 저장하는 환경 이라는 뜻

`EntityManager.persist(entity);`

영속성 컨텍스트는 논리적인 개념

눈에 보이지 않는다

엔티티 매니저를 통해 영속성 컨텍스트에 접근

엔티티 매니저 == 영속성 컨텍스트 라고 이해하자

캐시같은 친구구나~ 라고 이해라 그냥

### 엔티티의 생명주기

- 비영속
- 영속
- 준영속
- 삭제

### 비영속

멤버 객체 생성만 함 → 비영속 상태 

### 영속(managed)

멤버 객체를 생성하고, 

```java
EntityManager em=emf.createEntityManager();
em.persist(member)
```

→ 영속 상태가 됨

### 준영속

관리를 포기해버리는 상태

### 삭제

지우고, db에서도 날려버리는 상태

### 영속성 컨텍스트의 이점

- 1차 캐시
- 동일성 보장
- 트랜잭션을 지원하는 쓰기 지연
- 변경 감지
- 지연 로딩

### 1차 캐시

캐시라는 것이 내부에 있음. 

잠깐 존재하는 메모리 공간 

em.persist(member)를 하는 순간 key,value로 1차 캐시가 생성됨

**1차 캐시에서의 조회**

`em.find(Membe.class,”member1”)`

id가 member1인 멤버를 조회하면 DB로 먼저 가는 것이 아니라, 1차 캐시에서 조회를 시작함.

DB를 가지 않고, 바로 값을 반환할 수 있음.

`em.find(Membe.class,”member2”)`

1차 캐시에서 찾지만, member2가 없음 → DB에서 member2를 찾아서 1차 캐시에 저장 → 1차 캐시에서 값 반환

### 동일성 보장

```java
Member a=em.find(Member.class, "member1");
Member b=em.find(Member.class, "member1");

System.out.println(a==b); // 동일성 비교 true -> 1차 캐시에 저장되기 때문에 같은 ref로 나옴
```

 

### 트랜잭션을 지원하는 쓰기 지연

버퍼 기능을 해서 쿼리를 모으고, commit을 날리면 해당 쿼리들이 한번에 flush됨 

### 변경 감지

```java
...생략
Member memberA=em.find(Member.class,"memberA");

memberA.setUsername("hi");
memberA.setAge(10);

// em.update(member); 이런 코드가 있어야 하지 않을까? 

transaction.commit();
```

`em.update()`를 하지 않아도 됨. commit 하면 자동으로 update query가 나간다.

사실 1차 캐시가 생성될 때, 옆에 스냅샷이 생김. 

commit을 할 때 스냅샷과 1차 캐시에 저장된 값을 비교함 → 바뀐게 있으면 자동으로 update query문 날림 (메모리를 두배 쓰게됨)

마치 자바 컬렉션에 list에서 데이터 가져오고, 그냥 바꾸면 list에 값이 바뀌는 것 처럼~ 

플러시 발생

- 변경 감지
- 수정된 엔티티 쓰기 지연 SQL 저장소 등록
- 쓰기 지연 SQL 저장소의 쿼리를 DB에 전송

영속성 컨텍스트를 플러시하는 방법

- em.flush()
- 트랜잭션 커밋
- JPQL 쿼리 실행

플러시는...

- 영속성 컨테스트를 비우지 않음
- 영속성 컨텍스트의 변경 내용을 DB에 동기화
- 트랜잭션이라는 작업 단위가 중요 → 커밋 직전에만 동기화 하면 됨

준영속 상태

- 영속 → 준영속 상태
- 영속 상태의 엔티티가 영속성 컨텍스트에서 분리

준영속 상태로 만드는 방법

- em.detach(entity)
- em.clear()
- em.close()

### 지연 로딩

Member를 조회할 때 Team도 함께 조회해야 할까? 

지연로딩 LAZY를 사용해서 프록시로 조회

LAZY를 사용하면 프록시 객체라는 가짜 객체가 들어가게 됨

조회를 자주 하게 된다면? EAGER를 사용해서 함께 조회

프록시와 즉시로딩 주의

- 가급적 지연 로딩을 사용
- 즉시 로딩을 적용하면 예상하지 못한 SQL이 발생할 수도 있음. 연쇄작용이 나타날 수 있다.

------
## 7강 JPA 객체지향쿼리

[[토크ON세미나] JPA 프로그래밍 기본기 다지기 7강 - JPA 객체지향쿼리 | T아카데미](https://youtu.be/wt_BEqxjaj8)

JPQL 

- 가장 단순한 조회 방법
- EntityManager.find()
- 객체 그래프 탐색(a.getB().getC())
- 표준 SQL 문법과 비슷

JPA를 사용하면 엔티티 객체를 중심으로 개발

문제는 검색 쿼리

검색을 할 때도 테이블이 아닌 엔티티 개체를 대상으로 검색

모든 DB 데이터를 객체로 변환해서 검색하는 것은 불가능

애플리케이션이 필요한 데이터만 DB에서 불러오려면 결국 검색 조건이 포함된 SQL문이 필요함

 JPA는 SQL을 추상화한 JPQL 이라는 개체 지향 쿼리 언어 제공

```java
String jpql="select m from Member m where m.name like '%hello%'";
List<Member> result=em.createQuery(jpql,Member.class).getResultList();
```

테이블이 아닌 객체를 대상으로 검색하는 객체 지향 쿼리

SQL을 추상화해서 특정 DB SQL에 의존 X

from절에 들어가는 것이 객체이다.

대소문자 구분을 한다!

별칭은 필수

결과 조회 API

- query.getResultList() : 결과가  하나 이상, 리스트 반환
- query.getSingleResult() : 결과가 정확히 하나,  단일 객체 반환 (정확히 하나가 아니면 예외 발생)

파라미터 바인딩 - 이름 기준, 위치 기준 (이름으로 바인딩 해라~)

```java
SELECT m FROM Member m where m.username=:username
query.setParameter("username",usernameParam);

SELECT m FROM Member m where m.username=?1
query.setParameter(1,usernameParam); 
```

프로젝션

- SELECT m FROM Member m → 엔티티 프로젝션
- SELECT [m.team](http://m.team) FROM Member m → 엔티티 프로젝션
- SELECT username,age FROM Member m → 단순 값을 반환함!
    - 값을 바로 DTO에 넣고 싶을 것임
    - SELECT new jpabook.jpql.UserDTO(m.username,m.age) FROM Member m
    - 해당 쿼리처럼 쓰면 UserDTO로 바로 받을 수 있음
    

페이징 API

- setFirstResult(int startPosition) : 조회 시작 위치
- setMaxResults(int maxResult) : 조회할 데이터 수

```java
String jpql="select m from Member m order by m.name desc";
List<Member> resultList=em.createQuery(jpql,Member.class)
.setFirstResult(10)
.setMaxResults(20)
.getResultList();
```

집합과 정렬

조인

- 문법이 약간 다름
- `SELECT m FROM Member m [INNER] JOIN [m.team](http://m.team) t`

페치 조인 (현업에서 많이 씀)

- 엔티티 객체 그래프를 한번에 조회하는 방법
- 별칭 사용 X
- JPQL : `select m from Member m join fetch m.team`
- SLQ : `select m.*, t.* from member t inner join team t on m.team_id=t.id;`
- 지연 로딩 발생 X

CASE문 가능

사용자 정의 함수 호출 가능

Named 쿼리 - 어노테이션

@NamedQuery → 미리 쿼리문을 작성해 놓는 거

쿼리에 에러를 찾을 수 있다?

------------
### 2022.01.17
## React 2강

## 1. Before React

```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <span>Total clicks: 0</span>
    <button id="btn">Click me</button>
</body>
<script>
    const button=document.getElementById("btn");
    let counter=0;
    const span=document.querySelector("span");
    function handleClick(){
        console.log("clicked");
        counter++;
        span.innerHTML='Total clicks: '+counter;
    }
    button.addEventListener("click",handleClick);
</script>
</html>
```

react를 사용하기 위해 설치해야 하는 것 

react, react-dom

```html
<script src="https://unpkg.com/react@17.0.2/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js"></scrip
```

## **2. Our First React Element**

React는 엔진이다

React-dom은 React element를 HTML에 두는 역할을 하는 것

render = 사용자에게 보여준다.

```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
</body>
<script src="https://unpkg.com/react@17.0.2/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
<script>
    const root=document.getElementById("root");
    const span=React.createElement("span"); 
    ReactDOM.render(span,root); //render = 사용자에게 보여준다.
</script>
</html>
```

![Untitled](#2%2091248c63872144f5a35d8aad73912cbd/Untitled.png)

아이디 이름 정하기

```jsx
const span=React.createElement("span",{id:"cute-span"})
```

![Untitled](#2%2091248c63872144f5a35d8aad73912cbd/Untitled%201.png)

```jsx
const span=React.createElement("span",{id:"cute-span"},"Hello, I'm a span"); 
```

![Untitled](#2%2091248c63872144f5a35d8aad73912cbd/Untitled%202.png)

```jsx
const span=React.createElement("span",{id:"cute-span",style:{color:"blue"}},"Hello, I'm a span"); 
```

![Untitled](#2%2091248c63872144f5a35d8aad73912cbd/Untitled%203.png)

→ 이런 코드 한번만 쓸거임, 다른 간단한 방법이 있음.

바닐라JS는 Html부터 만들고, 그것을 JS가 가져오는 방식

ReactJS는 모든 것이 JS임 → 유저에게 보여질 내용을 컨트롤 할 수 있다.

## 3. **Events in React**

```jsx

<script src="https://unpkg.com/react@17.0.2/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
<script>
    const root=document.getElementById("root");
    const span=React.createElement("span",{id:"cute-span",style:{color:"blue"}},"Hello, I'm a span"); 
    const btn=React.createElement("button",{id:"btn"},"버튼이다");
    const container=React.createElement("div",null,[span,btn]);
    ReactDOM.render(container,root); //render = 사용자에게 보여준다.
</script>
```

div tag, btn tag 둘다 render 하고 싶으면 container 하나 만들어서 그안에 배열형태로 집어넣어주고, container를 render 해줌

button에 eventListner 달기

```jsx
const btn=React.createElement("button",{
        onClick:()=>console.log("i'm clicked"),
    },"버튼이다");
```

다른 evnetListner

```jsx
<script src="https://unpkg.com/react@17.0.2/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
<script>
    const root=document.getElementById("root");
    const h3=React.createElement("h3",{onMouseEnter: ()=>console.log("enter"),},"Hi");
    const span=React.createElement("span",{id:"cute-span",style:{color:"blue"}},"Hello, I'm a span"); 
    const btn=React.createElement("button",{
        onClick:()=>console.log("i'm clicked"),
    },"버튼이다");
    const container=React.createElement("div",null,[h3,span,btn]);
    ReactDOM.render(container,root); //render = 사용자에게 보여준다.
</script>
```

## 4. Recap

앞으로 `React.createElement`는 안쓸거임 

이전 시간 복습임 

## 5. JSX

createElement를 대체할 수 있는 JSX

왜? 더 편리해서 

- JSX는 JS를 확장한 문법
- Html과 생긴게 비슷해서 JSX로 React 요소를 만드는게 편하다

```jsx
const h3 = React.createElement("h3", { onMouseEnter: () => console.log("enter"), }, "Hi");
const Title=<h3 id="title" onMouseEnter={() => console.log("enter")}>Hi</h3> // JSX
```

```jsx
<script>
    const root = document.getElementById("root");
    const Title=<h3 
    id="title" onMouseEnter={() => console.log("Enter")}>
    Hi</h3> // JSX
    const Button=<button 
    id="btn" style={{color :
    'red'}} onClick={()=>console.log("Click me")}>
    button</button>
    const span = React.createElement("span", { id: "cute-span", style: { color: "blue" } }, "Hello, I'm a span");
    const container = React.createElement("div", null, [Title, span, Button]);
    ReactDOM.render(container, root); //render = 사용자에게 보여준다.
</script>
```

브라우저가 JSX를 알아들을 수 있도록 설정해주어야 함. 이때, Babel 사용함.

변환기 설치, script type 지정해줌

```jsx
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
```

## 6. JSX part Two

해당 부분을 JSX를 통해 바꿔보자!

```jsx
const container = React.createElement("div", null, [Title, Button]);
ReactDOM.render(container, root); //render = 사용자에게 보여준다.
```

Title과 Button을 div 안에 넣어주기 위해서는 함수로 만들어줘야 한다. 

```jsx
const Title= () => (<h3 
    id="title" onMouseEnter={() => console.log("Enter")}>
    Hi</h3>) // JSX
    const Button=() => (<button 
    id="btn" style={{color :
    'red'}} onClick={()=>console.log("Click me")}>
    button</button>)
```

우리가 만든 요소들은 모두 대문자로 시작해야 한다!

코드를 분리, 렌더링 가능 

**직접 만든 컨포넌트를 렌더링해서 다른곳에서 사용할 때에는 무조건 대문자로 시작해야 한다! 아니면 그냥 html 코드가 되어버림**

```jsx
const Container = <div>
        <Title />
        <Button />
    </div> //컴포넌트라고 생각하면 됨, 우리가 만든 요소들은 대문자로 작성하기
```

## React 3강
## 0. Understanding State

state = 데이터가 저장되는 곳

바뀌는 데이터를 state에 저장함 

값이 바뀔 데이터를 state에 담는 법

잠깐 JSX 복습 

함수 안에 React Element를 담으면 컴포넌트처럼 사용이 가능하다!

```jsx
const Button = () => (<button
        id="btn" style={{
            color:
                'red'
        }} onClick={() => console.log("Click me")}>
        button</button>);
```

2강에서 배웠던 js로 total clicks 만들었던거 react로 바꾸기

```jsx
<script type="text/babel">
    const root = document.getElementById("root");
    const Container = () => (<div>
        <h3>Total clicks: 0</h3>
        <button>Click me</button>
    </div>) //컴포넌트라고 생각하면 됨, 우리가 만든 요소들은 대문자로 작성하기 
    // const container = React.createElement("div", null, [Title, Button]);
    ReactDOM.render(<Container />, root); //render = 사용자에게 보여준다.
</script>
```

변수 연결해주기 → 중괄호 사용 { }

```jsx
<script type="text/babel">
    let counter = 10;
    const root = document.getElementById("root");
    const Container = () => (
        <div>
            <h3>Total clicks: {counter}</h3>
            <button>Click me</button>
        </div>); //컴포넌트라고 생각하면 됨, 우리가 만든 요소들은 대문자로 작성하기 
    // const container = React.createElement("div", null, [Title, Button]);
    ReactDOM.render(<Container />, root); //render = 사용자에게 보여준다.
</script>
```

카운터 변경 함수 만들고, button에 연결해주기

```jsx
<script type="text/babel">
    let counter = 0;
    function countUp(){
        counter=counter+1;
    }
    const root = document.getElementById("root");
    const Container = () => (
        <div>
            <h3>Total clicks: {counter}</h3>
            <button onClick={countUp}>Click me</button>
        </div>); //컴포넌트라고 생각하면 됨, 우리가 만든 요소들은 대문자로 작성하기 
    // const container = React.createElement("div", null, [Title, Button]);
    ReactDOM.render(<Container />, root); //render = 사용자에게 보여준다.
</script>
```

counter 변수는 바뀌지만, 바뀐 값이 UI에서는 그대로임!

container를 변수 값이 바뀔 때마다 render 해주어야 함

```jsx
function countUp(){
        counter=counter+1;
        render();
    }
function render(){
    ReactDOM.render(<Container />, root);
}
```

근데 이렇게 하면 코드가 많아질 때 일일히 다 렌더링 다시를 해주어야 하나..??

→ 더 쉬운 방법이 당연히 있음! 다음 강의에서..

## 1. **setState part One**

UI를 업데이트 하는 더 간단한 방법

React는 container를 새로 렌더링 하더라도 모든 것을 다시 렌더링 하지 않음. 바뀐 부분만 알아서 렌더링 해줌!

react 어플 내 데이터를 보관하고, 자동으로 리렌더링을 일으킬 수 있는 방법

```jsx
<script type="text/babel">
    const root = document.getElementById("root");
    function App(){
        const data=React.useState();
        console.log(data);
        return(
            <div>
            <h3>Total clicks: {data[0]}</h3>
            <button>Click me</button>
        </div>
        );
    }
   ReactDOM.render(<App />, root); //render = 사용자에게 보여준다.
</script>
```

![Untitled](#3%2071c7dde6510245c1934dea7ca8969a22/Untitled.png)

undefined 부분이 data, f 부분이 data를 바꿀 때 사용하는 함수

```jsx
//원래 코드
let counter=0;
function countUp(){
	//code
}

//React state 사용 코드 
const data=React.useState(); 
```

둘 다는 같은 코드임!

```jsx
<script type="text/babel">
    const root = document.getElementById("root");
    function App(){
        const data=React.useState(0);
        const[counter,modifier] = data;
        return(
            <div>
            <h3>Total clicks: {counter}</h3>
            <button>Click me</button>
        </div>
        );
    }
   ReactDOM.render(<App />, root); //render = 사용자에게 보여준다.
</script>
```

## **2. setState part Two**

modifier 작성법

```jsx
const data=React.useState(0);
const [counter,modifier] = data;
```

이렇게 새로운 배열을 하나 더 선언해주면 data[0]. data[1] 이렇게 쓰지 않고도 counter, modifier의 값으로 사용할 수 있다.

카운트 올리기 코드 

modifier 함수 이름을 setCounter라고 바꾸고, 함수의 인자값을 하고싶은 계산식으로 만들어줌 

```jsx
<script type="text/babel">
    const root = document.getElementById("root");
    function App(){
        const data=React.useState(0);
        const [counter,setCounter] = data;
        const onClick = () => {
            setCounter(counter+1);
        }
        return(
            <div>
            <h3>Total clicks: {counter}</h3>
            <button onClick={onClick}>Click me</button>
        </div>
        );
    }
   ReactDOM.render(<App />, root); //render = 사용자에게 보여준다.
</script>
```

## 3. Recap

앞에꺼 복습 

## 4. **State Functions**

state를 바꾸는 2가지 방법

- setCounter를 이용해 우리가 원하는 값을 넣어주는 것
- 이전 값을 이용해 현재 값을 계산하는 것
    - **setCounter의 인자 부분에 함수를 넣음** → 더 안전한 방법
        
        current가 현재 값이라는 완벽한 보장을 할 수 있어서...?
        
        ```jsx
        setCounter((current)=>current+1)
        ```
        

---

## 5. **Inputs and State**

단위 변환 페이지 만들기

```jsx
function App(){
        return(
            <div>
            <h1>Super Converter</h1>
            <label for="minutes">Minutes</label>
            <input type="number" id="minutes" placeholder="Minutes" />
            <label for="hours">Hours</label>
            <input type="number" id="hours" placeholder="Hours" />
        </div>
        );
    }
```

jsx는 html과 유사하지만 다른 점 몇가지가 있음.

- class와 for를 사용하면 안된다.

```jsx
function App(){
        const [minutes,setMinutes]=React.useState();
        const onChange=(event)=>{
            console.log(event.target.value);
            setMinutes(event.target.value);
        }
        return(
            <div>
            <h1>Super Converter</h1>
            <label for="minutes">Minutes</label>
            <input value={minutes} 
            type="number" 
            id="minutes" 
            placeholder="Minutes" 
            onChange={onChange}/>
            <h4>You want to convert {minutes}</h4>
            <label for="hours">Hours</label>
            <input type="number" id="hours" placeholder="Hours" />
        </div>
        );
    }
```

![Untitled](#3%2071c7dde6510245c1934dea7ca8969a22/Untitled%201.png)

## **6. State Practice part One**

- state 만들기
    - state의 결과는 배열
        - 첫번째 요소는 value
        - 두번째 요소는 value를 업데이트 하는 함수
- input의 value를 state로 연결
- onChange 함수를 만들어서 input에 연결
    - 해당 함수는 데이터를 업데이트 해주는 역할

```jsx
function App(){
        const [minutes,setMinutes]=React.useState(0);
        const onChange=(event)=>{
            console.log(event.target.value);
            setMinutes(event.target.value);
        }
        const reset=()=>{
            setMinutes(0);
        }
        return(
            <div>
            <h1>Super Converter</h1>
            <div>
                <label htmlFor="minutes">Minutes</label>
                <input value={minutes} 
                type="number" 
                id="minutes" 
                placeholder="Minutes" 
                onChange={onChange}/>
            </div>
            <div>
                <label htmlFor="hours">Hours</label>
                <input value={minutes/60} type="number" id="hours" placeholder="Hours"/>
            </div>
            <button onClick={reset}>Reset</button>
        </div>
        );
    }
```

------------
### 2022.01.18
## Kurento

[Kurento](https://doc-kurento.readthedocs.io/en/6.9.0/glossary.html#term-kurento) 는 [WebRTC](https://doc-kurento.readthedocs.io/en/6.9.0/glossary.html#term-webrtc) 미디어 서버이자 웹 및 스마트폰 플랫폼용 고급 비디오 애플리케이션 개발을 단순화하는 클라이언트 API 세트입니다. 그 기능에는 그룹 커뮤니케이션, 트랜스코딩, 녹음, 믹싱, 방송 및 시청각 흐름 라우팅이 포함됩니다.

## kurento와 같은 미디어 서버를 사용하는 이유

[WebRTC](https://webrtc.org/) 는 브라우저와 모바일 애플리케이션에 피어 투 피어 연결을 통해 실시간 통신(RTC) 기능을 제공하는 일련의 프로토콜, 메커니즘 및 API입니다. 어떤 종류의 인프라도 중재하지 않고 브라우저가 직접 통신할 수 있도록 하는 기술로 인식되었습니다. 그러나 이 모델은 기본 웹 애플리케이션을 만드는 데만 충분합니다. **그룹 통신, 미디어 스트림 녹음, 미디어 방송 또는 미디어 트랜스코딩과 같은 기능은 그 위에 구현하기 어렵습니다.** 이러한 이유로 많은 응용 프로그램에 중간 미디어 서버가 필요합니다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0a93837a-329b-4172-8c5c-998ba4912d43/Untitled.png)

### WebRTC Media Server가 제공하는 기능들

- 그룹 통신: 한 피어가 생성하는 미디어 스트림을 여러 수신기에 배포하는 것, 즉 다중 회의 장치("MCU") 역할을 합니다.
- 혼합: 여러 수신 스트림을 하나의 단일 복합 스트림으로 변환합니다.
- 트랜스코딩: 호환되지 않는 클라이언트 간에 코덱 및 형식을 즉시 적용합니다.
- 녹음: 피어 간에 교환되는 미디어를 지속적으로 저장합니다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b946aa7a-efd5-41ce-a310-8b12c557edac/Untitled.png)

Kurento의 주요 구성 요소는 미디어 전송, 처리, 녹음 및 재생을 담당하는 KMS( **Kurento Media Server )입니다.**

### KMS가 제공하는 주요 기능들

- [HTTP,](https://doc-kurento.readthedocs.io/en/6.9.0/glossary.html#term-http)[RTP 및](https://doc-kurento.readthedocs.io/en/6.9.0/glossary.html#term-rtp) [WebRTC](https://doc-kurento.readthedocs.io/en/6.9.0/glossary.html#term-webrtc)를 포함한 네트워크 스트리밍 프로토콜
- 미디어 믹싱과 미디어 라우팅/디스패칭을 모두 지원하는 그룹 통신(MCU 및 SFU 기능)
- Computer Vision 및 Augmented Reality 알고리즘을 구현하는 필터에 대한 일반 지원
- [WebM 및](https://doc-kurento.readthedocs.io/en/6.9.0/glossary.html#term-webm)  [MP4](https://doc-kurento.readthedocs.io/en/6.9.0/glossary.html#term-mp4) **에 대한 쓰기 작업과 GStreamer 에서 지원하는 모든 형식의 재생 을 지원하는 미디어 저장소입니다.
- VP8, H.264, H.263, AMR, OPUS, Speex, G.711 등을 포함하여 GStreamer에서 지원하는 모든 코덱 간의 자동 미디어 트랜스코딩

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7ab98bf4-1f88-433f-a676-8be44eee2331/Untitled.png)

## 쿠렌토 설치 방법 3가지

- [Amazon Web Services](https://aws.amazon.com/)

  (AWS) 클라우드 서비스 에서 EC2 인스턴스 사용 . 제공된 설정이 이 모든 작업을 자동으로 수행하기 때문에 서버와 모든 소프트웨어 패키지를 올바르게 구성하는 것에 대해 걱정하지 않으려는 사용자에게 AWS를 사용하는 것이 좋습니다.

- Kurento 팀에서 제공한 Docker 이미지 사용. Docker 이미지를 사용하면 모든 호스트 컴퓨터에서 Kurento를 실행할 수 있으므로 예를 들어 Fedora 또는 CentOS 시스템 위에서 KMS를 실행할 수 있습니다. 이론상으로는 Windows에서도 실행할 수 있지만 지금까지 그 가능성은 탐색되지 않았으므로 사용자가 위험을 감수해야 합니다.

- 모든 Ubuntu 시스템에서 ,를 사용한 로컬 설치 . 이 방법을 사용하면 설치 프로세스를 완전히 제어할 수 있습니다. KMS를 설치하는 것 외에도 , 특히 KMS 또는 해당 클라이언트가 [NAT](https://doc-kurento.readthedocs.io/en/6.9.0/glossary.html#term-nat) 방화벽 뒤에 있는 경우에는 [STUN](https://doc-kurento.readthedocs.io/en/6.9.0/glossary.html#term-stun) 또는 [TURN 서버도 설치해야 합니다.](https://doc-kurento.readthedocs.io/en/6.9.0/glossary.html#term-turn)`apt-get install`

## 쿠렌토 서버 실행시키기
[[Kurento\] 쿠렌토 서버 Docker로 실행시켜보기 (feat. 윈도우)](https://gh402.tistory.com/44)
[Windows 10에서 WSL2를 이용하여 Ubuntu 설치하는 방법](https://wylee-developer.tistory.com/57)

------------
### 2022.01.19
## KMS, STUN/TURN 서버 설정 및 skeleton 코드 실행

webRTC기술 학습과 주요 기능 구현 pdf 파일을 참고하여 Ubuntu 환경에서 docker에 KMS, STUN/TURN 서버 설정

싸피에서 제공한 skeleton 코드 실행 
![이미지](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FW19IV%2FbtrrcgQKUue%2FjKcXsLv1IrFQ1OwqUpZSbK%2Fimg.png)

실행 결과
![이미지](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdVE3i8%2FbtrrcNN5aOE%2FftUO1QorYKzI8ifna22FBK%2Fimg.png)

------------
### 2022.01.20
## SockJS 기반 채팅 서버 예제 따라해보기

쿠렌토 서버는 다음주 월요일 AWS계정 받으면 하기로 하고, 우선 웹소켓 통신부터 공부함.

https://supawer0728.github.io/2018/03/30/spring-websocket/

https://github.com/supawer0728/simple-websocket/blob/master/src/main/resources/templates/chat1/room-detail.html

!주요 코드만 담았음

ChatHandler.java

```java
package com.ssafy.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.db.dto.ChatMessage;
import com.ssafy.db.dto.ChatRoom;
import com.ssafy.db.repository.ChatRoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Slf4j
@Profile("!stomp")
@Component
public class ChatHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final ChatRoomRepository repository;

    @Autowired
    public ChatHandler(ObjectMapper objectMapper, ChatRoomRepository chatRoomRepository) {
        this.objectMapper = objectMapper;
        this.repository = chatRoomRepository;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        String payload = message.getPayload();
        log.info("payload : {}", payload);

        ChatMessage chatMessage = objectMapper.readValue(payload, ChatMessage.class);
        ChatRoom chatRoom = repository.getChatRoom(chatMessage.getChatRoomId());
        chatRoom.handleMessage(session, chatMessage, objectMapper);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        repository.remove(session);
    }
}
```

WebSocketConfig.java

```java
package com.ssafy.config;

import com.ssafy.common.ChatHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Profile("!stomp")
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Autowired
    private ChatHandler chatHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatHandler, "/ws/chat").setAllowedOrigins("*").withSockJS();
    }
}
```


ChatRoomController.java

```java
package com.ssafy.api.controller;

import com.ssafy.db.dto.ChatRoom;
import com.ssafy.db.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.ui.Model;

import java.util.concurrent.atomic.AtomicInteger;

@Controller
@RequestMapping("/chat1")
public class ChatRoomController {

    private final ChatRoomRepository repository;
//    private final String listViewName;
//    private final String detailViewName;
    private final AtomicInteger seq = new AtomicInteger(0);

    @Autowired
    public ChatRoomController(ChatRoomRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/rooms")
    public String rooms(Model model) {
        model.addAttribute("rooms", repository.getChatRooms());
        return "/chat1/room-list";
    }

    @GetMapping("/rooms/{id}")
    public String room(@PathVariable String id, Model model) {
        ChatRoom room = repository.getChatRoom(id);
        model.addAttribute("room", room);
        model.addAttribute("member", "member" + seq.incrementAndGet()); // 회원 이름 부여

        return "/chat1/room";
    }
}

```

### Spring Sockets - WebSocket, SockJS, STOMP 공부 중

https://www.youtube.com/watch?v=gQyRxPjssWg&ab_channel=%EC%8B%9C%EB%8B%88%EC%96%B4%EC%BD%94%EB%94%A9


- WebSocket
  - 사용자의 브라우저와 서버 사이의 인터렉티브 통신 세션을 설정할 수 있게 하는 고급 기술.
- SockJS 
  - socket.io는 NodeJS 기반
  - sprnig은 SockJS client가 있음.
  - 웹 소켓과 유사함
- STOMP
  - Spring Only
  - Use stomp js library
  - SockJS의 서브 프로토콜

메세지 형식은 JSON을 사용하는 것이 좋다고 함.




