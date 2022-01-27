# Kurento Group Call

## 동작 원리

- 각 룸은 다른 룸들과 개별적으로 동작한다. (Each room will create its own pipeline, being isolated from the other rooms.)
- 클라이언트가 특정 룸에 접속하면 같은 룸에 있는 다른 클라이언트들과 media를 교환하게 됨
- 각 클라이언트는 자신의 media를 보냄
- 각 클라이언트는 다른 모든 참여자들로부터 media를 받음 (N = 참여자 수라면 각 방의 endpoint는 N\*N)

## 새 클라이언트 입장

- 새 클라이언트가 들어옴
- 새 webRTC가 만들어지고 서버에 있는 media를 수신
- 다른 참여자들은 새 참여자가 들어왔음을 공지받음
- 다른 참여자들은 서버에게 새 참여자의 media를 요청함
- 새 클라이언트는 현재 방의 다른 모든 참여자들로부터 media를 수신하도록 요청함

## 1명이 나갈 때

- 클라이언트가 나가면 다른 클라이언트들은 서버로부터 나갔음을 공지받음
- client-side에서 서버로 나간 클라이언트의 media elements를 삭제하도록 요청을 보냄

## architecture

- client-side: JavaScript
- server-side: Kurento Java Client API를 사용한 Spring Boot Application
- 필요한 웹소켓은 2개
  - 1.  custom signaling protocol을 구현하기 위한 client - server간의 webSocket
  - 2.  Kurento Java Client와 Kurento Media Server 간의 통신을 위한 webSocket (Kurento protocol을 사용하여 이루어짐)

## References

[Tutorials > Java - Group Call](https://doc-kurento.readthedocs.io/en/stable/tutorials/java/tutorial-groupcall.html)
