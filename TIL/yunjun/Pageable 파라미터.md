# Pageable 파라미터

Spring Data 에서는 편리한 페이지네이션을 위해 Pageable 객체를 제공한다.

이를 이용하면 백엔드와 프론트엔드 모두 편하게, 페이지네이션과 정렬을 할 수 있다.

Controller에서 Pageable 객체를 인자로 받을 때, 프론트에서 보낼 수 있는 요청에 대해서 정리해 보았다.

```bash
localhost:8080/study?page=0&size=10
```

정말 기본적으로, 0번 페이지부터 10개의 데이터를 요청하는 것이다.

(JPA에서 첫 페이지는 0페이지다)

여기에 추가로 sort 옵션을 넣을 수 있다.

```bash
localhost:8080/study?page=0&size=10&sort=createdAt
```

위 코드에서, 생성일자를 기준으로 정렬하는 조건을 추가한 것이다. 

default는 asc이지만, 아래와 같이 정렬기준을 변경해서 요청할 수 도 있다.

( `,` 뒤에 공백을 넣지 않도록 주의하자, 오류난다)

```bash
localhost:8080/study?page=0&size=10&sort=createdAt,desc
```

정말 놀랍게도, 연관관계로 엮여있는 엔티티 속성을 이용해서도 정렬할 수 있다

```bash
http://localhost:8080/study?page=0&size=10&sort=host.email
```

아래와 같이 요청하면 이런 쿼리가 나간다

```bash
Hibernate: 
    select
        study0_.id as id1_6_0_,
        user1_.user_id as user_id1_7_1_,
        study0_.created_at as created_2_6_0_,
        study0_.host_id as host_id9_6_0_,
        study0_.introduction as introduc3_6_0_,
        study0_.last_access_time as last_acc4_6_0_,
        study0_.name as name5_6_0_,
        study0_.number as number6_6_0_,
        study0_.target as target7_6_0_,
        study0_.total_time as total_ti8_6_0_,
        user1_.email as email2_7_1_,
        user1_.image_url as image_ur3_7_1_,
        user1_.nickname as nickname4_7_1_,
        user1_.password as password5_7_1_,
        user1_.provider as provider6_7_1_,
        user1_.provider_id as provider7_7_1_,
        user1_.role as role8_7_1_ 
    from
        study study0_ 
    left outer join
        user user1_ 
            on study0_.host_id=user1_.user_id 
    order by
        user1_.email asc limit ?
Hibernate: 
    select
        count(study0_.id) as col_0_0_ 
    from
        study study0_
```

놀랍게도, 아래서 order by 옵션을 작성해준다. 이렇게 편리하다니 정말 JPA 애정하지 않을 수 없다.

![압도적감사-JPA.jpg](./img/압도적감사-JPA.jpg)

페이지네이션을 위한, count쿼리도 같이 나간다.

sort 조건을 여러개 걸고 싶을 땐 아래와 같이 하면 된다

```bash
localhost:8080/study?page=0&size=10&sort=createdAt,name
```

하지만 sort항목 마다 정렬 조건을 따로 걸고 싶으면 어떻게 할까?

```bash
localhost:8080/study?page=0&size=10&sort=createdAt,desc&sort=name,asc
```

각 항목을 따로 담으면 된다