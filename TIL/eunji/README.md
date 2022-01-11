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