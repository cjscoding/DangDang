# WebRTC

web Real-Time Communication

## WebRTC API

* 웹 애플리캐이션과 사이트가 중간자 없이 브라우저간에 오디오나 영상 미디어를 포착하고 스트림하거나, 임의의 데이터도 교환할 수 있도록 하는 기술
* 제 3자 소프트웨어 설치 없이 종단 간 데이터 공유와 화상회의를 가능하게 한다.
* 이를 위해 WebRTC는 상호 연관된 API와 프로토콜로 구성되어 함께 작동한다.

<br>

## 상호 운용성

* WebRTC의 구현은 계속 진화하지만 각 브라우저마다 다른 코덱 및 기타 미디어 기능에 대한 지원 수준이 다름.
* 코드 작성을 시작하기 전 Google에서 제공하는 [Adapter.js 라이브러리](https://github.com/webrtcHacks/adapter) 를 사용하는것을 고려 해 보아야 함.

#### Adapter.js

* shim 및 polyfill을 사용해 다양한 플랫폼에서 WebRTC 구현 간의 다양한 차이점을 없애준다.
* WebRTC 개발 프로세스를 전체적으로 쉽게 수행할 수 있도록 접두사와 다른 이름 지정의 차이점을 처리한다
* 따라서 광범위하게 호환되는 결과를 제공한다.

자세한 내용 참고 : [Improving compatibility using WebRTC adapter.js](https://developer.mozilla.org/ko/docs/Web/API/WebRTC_API/adapter.js)

<br>

## 개념 및 사용법

* WebRTC는 여러가지 목적으로 사용될 수 있는데 Media Capture and Streams API와 많은 부분이 겹친다.
* 그렇지만, 서로 상호작용을 하면서 웹에 강력한 멀티미디어 기능을 제공한다.
* ex ) 음성, 화상 회의, 파일 교환 ...
* 피어들 간 커넥션이 만들어지는데 드라이버나 플러그인이 필요하지 않다.

<br>

#### 커넥션

* 두 피어 간 커넥션은 [RTCPeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) 인터페이스를 통해 이루어진다.
* 커넥션이 이루어지고 열린다면, 미디어 스트림(MediaStream)들과 데이터 채널(RTCDataChannel)들을 커넥션에 연결할 수 있다.

<br>

#### 미디어 스트림

* 미디어 스트림들은 미디어 정보를 가지는 다수의 트랙들로 구성된다.
* [MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) 인터페이스 object를 베이스로 하는 트랙은 음성, 영상 및 텍스트(제목 또는 챕터 이름)를 포함하는 다양한 미디어 데이터의 타입 중 하나를 포함할 수 있다.
* 대부분의 스트림들은 적어도 한개 이상의 음성 트랙으로 구성되어있다.
* live 미디어(web cam) 또는 저장된 Media들을 전송하고 받을 수 있다.
* 임의의 바이너리 데이터(image , text, ...)를 RTCDataChannel인터페이스를 통해 피어들 간에 교환할 수 있다.

<br>