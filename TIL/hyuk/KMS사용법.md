# WSL2 + Ubuntu를 사용한 Kurento Media Server 실습(Docker)

WSL2를 이용해 Ubuntu18.04의 리눅스 환경 위에서 Kurento Media Server를 동작시켜보자.

<br>

모든 것은 Ubuntu에서 실행한다.

* 기본 환경 셋팅(git, jdk, maven 설치)

```
sudo apt-get update && sudo apt-get install --no-install-recommends \
    git \
    default-jdk \
    maven
```

* docker설치

```
sudo apt-get install docker
```

* KMS의 docker image 가져오기

```
docker pull kurento/kurento-media-server:latest
```

만약 오류가 발생해서 이미지를 가져올 수 없다면 아래 두 구문 중 하나를 실행해본다.

```
sudo chmod 666 /var/run/docker.sock

sudo chown root:docker /var/run/docker.sock
```



* pull이 제대로 되었다면 현재 디렉토리를 실행할 튜토리얼 폴더로 이동한다. 여기에서는 Helloworld를 실행해보기로 한다.

```
cd kurento-tutorial-java
cd kurento-hello-world
git checkout master
```

- docker로 KMS 실행
```
docker run -d --rm \-p 8080:8888/tcp \-p 5000-5050:5000-5050/udp \-e KMS_MIN_PORT=5000 \-e KMS_MAX_PORT=5050 \kurento/kurento-media-server:latest
```

-d 옵션은 서버를 백그라운드에서 돌리겠다는 의미이다.

종료하길 원한다면

```
docker ps
```

위 명령어를 치면 나오는 서버에서 kms의 name을 보고

```
docker stop name
```

을 입력하면 서버가 종료된다.



- 튜토리얼 어플리케이션 실행
```
mvn -U clean spring-boot:run
```

* 접속

https://localhost:8443/





## Singnaling Server 구조

https://kid-dev.tistory.com/5







221.160.233.92:8083