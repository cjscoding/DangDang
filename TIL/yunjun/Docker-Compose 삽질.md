# Docker-Compose 남들 다 되는데 나만 안될 때

백엔드와 프론트엔드를 완전 나눠서 프로젝트를 진행하고 있는데,

어느정도 CRUD API가 만들어진 후, 프론트분들이 편하게 돌릴 수 있도록

docker-compose로 배포하는 작업을 하던 중

분명 잘못된 설정이 없는데 안된 일이 발생했다.

docker로 배포할 것은 Spring-boot, Redis, MongoDB, Mysql이였다.

이게 Spring 내에서 application.yaml파일이였다.

```yaml
spring:
  config:
    activate:
      on-profile: prod

  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://dangdang-mysql:3306/dangdang?useUnicode=yes&characterEncoding=UTF-8&allowMultiQueries=true&serverTimezone=Asia/Seoul
    username: ssafy
    password: ssafy

  jpa:
    hibernate:
      ddl-auto: create
    generate-ddl: false
    properties:
      hibernate:
        format_sql: true
        show_sql: true
        dialect : org.hibernate.dialect.MySQL8Dialect
    open-in-view: false

  data:
    mongodb:
      uri: mongodb://dangdang-mongodb:27017/dangdang

  session:
    store-type: REDIS
  redis:
    host: dangdang-redis
    port: 6379
```

그리고 이게 Docker-compose.yaml 파일이였다.

```yaml
version: "3"

services:
  backend:
    image: backend:0.1
    build: ./backend/dangdang
    environment:
      SPRING_DATASOURCE_URL: "jdbc:mysql://dangdang-mysql:3306/dangdang?useUnicode=yes&characterEncoding=UTF-8&allowMultiQueries=true&serverTimezone=Asia/Seoul"
      SPRING_DATASOURCE_USERNAME: "ssafy"
      SPRING_DATASOURCE_PASSWORD: "ssafy"
      SPRING_REDIS_HOST: "dangdang-redis"
      SPRING_REDIS_PORT: "6370"
      SPRING_DATA_MONGODB_HOST: "dangdang-mongodb"
      SPRING_DATA_MONGODB_PORT: 27017
      SPRING_DATA_MONGODB_USERNAME: "root"
      SPRING_DATA_MONGODB_PASSWORD: "root"
      SPRING_DATA_MONGODB_DATABASE: "dangdang"
    ports:
      - 8080:8080
    depends_on:
      - "dangdang-mongodb"
      - "dangdang-mysql"
      - "dangdang-redis"
    restart: always
    links:
      - dangdang-mongodb
    networks:
      - dangdang_network

  dangdang-mysql:
    image: mysql:8.0.28
    environment:
      MYSQL_ROOT_PASSWORD: "root"
      MYSQL_DATABASE: "dangdang"
      MYSQL_HOST: "%"
      MYSQL_USER: "ssafy"
      MYSQL_PASSWORD: "ssafy"
    command:
      [
        "--character-set-server=utf8mb4",
        "--collation-server=utf8mb4_unicode_ci"
      ]
    ports:
      - 3306:3306
    restart: always
    networks:
    - dangdang_network

  dangdang-redis:
    image: redis:6.2.6
    command: redis-server --port 6379
    ports:
      - 6379:6379
    restart: always
    networks:
      - dangdang_network

  dangdang-mongodb:
    image: mongo:5
    ports:
      - 27017:27017
    restart: always
    networks:
      - dangdang_network
    command: mongod

networks:
  dangdang_network:
    driver: bridge
```

당시에 에러를 캡처하는 것은 깜박했지만,

견문이 부족했던 나는 에러 로그를 열심히 읽어도 무엇이 잘못되서 발생하는 것인지 짐작하기 어려웠다.

무엇이 잘못된 것인지 몰라서 나는 이것저것 추가하고 빼기를 한참을 반복한 뒤 알았다...

application.yaml파일에는 MongoDB 설정이

```yaml
spring:
	data:
	    mongodb:
	      uri: mongodb://dangdang-mongodb:27017/dangdang
```

이렇게 적혀 있지만

docker-compose.yaml에는 이렇게 적혀 있었다

```yaml
backend:
    image: backend:0.1
    build: ./backend/dangdang
    environment:
      SPRING_DATASOURCE_URL: "jdbc:mysql://dangdang-mysql:3306/dangdang?useUnicode=yes&characterEncoding=UTF-8&allowMultiQueries=true&serverTimezone=Asia/Seoul"
      SPRING_DATASOURCE_USERNAME: "ssafy"
      SPRING_DATASOURCE_PASSWORD: "ssafy"
      SPRING_REDIS_HOST: "dangdang-redis"
      SPRING_REDIS_PORT: "6370"
      SPRING_DATA_MONGODB_HOST: "dangdang-mongodb"
      SPRING_DATA_MONGODB_PORT: 27017
      SPRING_DATA_MONGODB_USERNAME: "root"
      SPRING_DATA_MONGODB_PASSWORD: "root"
      SPRING_DATA_MONGODB_DATABASE: "dangdang"
```

이 둘을 같은 양식으로 작성해야만 제대로 돌아갔던 것이다.....

형식이 달라도 같은 내용이기에, 당연히 작동할 것이라고 생각했던 것이 오산이였다

위 코드를 아래처럼 바꾸니 잘 작동했다.

```yaml
services:
  backend:
    image: backend:0.1
    build: ./backend/dangdang
    environment:
      SPRING_DATASOURCE_URL: "jdbc:mysql://dangdang-mysql:3306/dangdang?useUnicode=yes&characterEncoding=UTF-8&allowMultiQueries=true&serverTimezone=Asia/Seoul"
      SPRING_DATASOURCE_USERNAME: "ssafy"
      SPRING_DATASOURCE_PASSWORD: "ssafy"
      SPRING_DATA_MONGODB_URI: "mongodb://dangdang-mongodb:27017/dangdang"
      SPRING_REDIS_HOST: "dangdang-redis"
      SPRING_REDIS_PORT: "6379"
    ports:
      - 8080:8080
    depends_on:
      - "dangdang-mongodb"
      - "dangdang-mysql"
      - "dangdang-redis"
    restart: always
    links:
      - dangdang-mongodb
    networks:
      - dangdang_network
```