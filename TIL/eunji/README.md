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
