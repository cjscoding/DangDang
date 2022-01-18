# WebRTC 기본2

### Janus Server

WebRTC는 Peer to Peer 통신 형태로 이루어지는데 실제로는 signaling메타데이터의 교환으로 이루어진다.

실제 통신을 위해서는 이를 중계해주는 서버가 필요한데 이것중 하나가 Janus Server이다.

<br>

### 1:N 화상통신

1. Janus Server에 CREATE메세지에 방번호, 설정등을 담아 보내면 방이 생성된다.
2. 방에 참여하기 위해 JOIN메시지에 방번호, 방에서 하려는 역할(PUBLISHER)을 담아 보내면 방에 참여할 수 있게 된다.(참여 후 방송 준비를 할 수 있는 상태.)
3. 방송을 하기위해 CREATE OFFER 메세지를 보내면 PUBLISH를 할 수 있는 상태가 된다.
4. PUBLISH 메세지를 보내면 Janus Server로부터 STREAM이 들어오고 방송할 수 있는 상태가 된다.
5. 방송에 참여하는 사람은 JOIN메세지에 방 번호, 역할(SUBSCRIBER), FEED를 넣어 보내면 방에 입장하게 된다.
6. PUBLISHER가 날렸던 CREATE OFFER메시지를 CREATE ANSWER로 응답하면 방송을 볼 수 있는 준비가 완료된다.
7. START메세지를 보내면 PUBLISHER가 송출하는 영상을 받아 볼 수 있다.

<br>

### 1:1 화상통신

1. Janus Server에 CREATE메세지에 방 번호, 설정, PIN번호를 넣어 보내면 방이 생성된다.
2. 방에 들어가기 위해 JOIN메세지를 보내는데 방 번호, 역할(PUBLISHER), 핀번호(a.k.a. 비밀번호)를 넣어 보내면 방에 입장된다.
3. CREATE OFFER, PUBLISH메시지를 순차적으로 보내면 방송을 할 수 있게 된다.
4. user2가 들어올 때도 마찬가지로 CREATE, 방 번호, 역할(PUBLISHER), 핀 번호를 넣어 Janus Server에 보내면 방에 입장된다.
5. JOIN 하자마자 CREATE OFFER메시지를 받게 되고 CREATE ANSWER메시지로 응답하면 user1의 방송을 볼 수 있게 된다.
6. user2가 CREATE OFFER메세지를 보내고 PUBLISH메세지를 보내면 user1도 user2의 화면을 볼 수 있게 된다.

