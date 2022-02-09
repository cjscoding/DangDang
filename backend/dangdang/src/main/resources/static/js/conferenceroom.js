/**
 * ScreenHandler
 * @constructor
 */
function ScreenHandler() {
    console.log('Loaded ScreenHandler', arguments);

    // REF https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#Properties_of_shared_screen_tracks
    const constraints = {
        audio: true,
        video: {
            width: 1980, // 최대 너비
            height: 1080, // 최대 높이
            frameRate: 10, // 최대 프레임
        },
    };
    let localStream = null;

    /**
     * 스크린캡쳐 API를 브라우저 호환성 맞게 리턴합니다.
     * navigator.mediaDevices.getDisplayMedia 호출 (크롬 72 이상 지원)
     * navigator.getDisplayMedia 호출 (크롬 70 ~ 71 실험실기능 활성화 or Edge)
     */
    function getCrossBrowserScreenCapture() {
        if (navigator.getDisplayMedia) {
            return navigator.getDisplayMedia(constraints);
        } else if (navigator.mediaDevices.getDisplayMedia) {
            return navigator.mediaDevices.getDisplayMedia(constraints);
        }
    }

    /**
     * 스크린캡쳐 API를 호출합니다.
     * @returns localStream
     */
    async function start() {
        try {
            localStream = await getCrossBrowserScreenCapture();
        } catch (err) {
            console.error('Error getDisplayMedia', err);
        }

        return localStream;
    }

    /**
     * 스트림의 트렉을 stop()시켜 스트림이 전송을 중지합니다.
     */
    function end() {
        localStream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    /**
     * extends
     */
    this.start = start;
    this.end = end;
}


/***************************************************************************/
/*!
 *
 * WebRTC Lab
 * @author dodortus (dodortus@gmail.com / codejs.co.kr)
 *
 */
const screenHandler = new ScreenHandler();

/**
 * 로컬 스트림 핸들링
 * @param stream
 */
function onLocalStream(stream) {
    console.log('onLocalStream', stream);
    // const $video = document.querySelector('#video-'+name);
    const $video = document.querySelector('#local-video');
    $video.srcObject = stream;
}

/**
 * screenHandler를 통해 스크린 API를 호출합니다.
 */

async function startScreenShare() {
    const stream = await screenHandler.start();
    onLocalStream(stream);

}

/**
 * 초기 이벤트 바인딩
 */
function initialize() {
    document.querySelector('#btn-start').addEventListener('click', startScreenShare);
}

initialize();


/*************************************************************************************/
/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var ws = new SockJS('https://localhost:8443/groupcall');
var participants = {};
var name;

window.onbeforeunload = function () {
    ws.close();
};

ws.onmessage = function (message) {
    var parsedMessage = JSON.parse(message.data);
    console.info('Received message: ' + message.data);

    switch (parsedMessage.id) {
        case 'existingParticipants':
            onExistingParticipants(parsedMessage);
            break;
        case 'newParticipantArrived':
            onNewParticipant(parsedMessage);
            break;
        case 'participantLeft':
            onParticipantLeft(parsedMessage);
            break;
        case 'receiveVideoAnswer':
            receiveVideoResponse(parsedMessage);
            break;
        case 'iceCandidate':
            participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
                if (error) {
                    console.error("Error adding candidate: " + error);
                    return;
                }
            });
            break;
        default:
            console.error('Unrecognized message', parsedMessage);
    }
}

function register() {
    name = document.getElementById('name').value;
    var room = document.getElementById('roomName').value;

    document.getElementById('room-header').innerText = 'ROOM ' + room;
    document.getElementById('join').style.display = 'none';
    document.getElementById('room').style.display = 'block';

    var message = {
        id: 'joinRoom',
        name: name,
        room: room,
    }
    sendMessage(message);
}

function onNewParticipant(request) {
    receiveVideo(request.name);
}

function receiveVideoResponse(result) {
    participants[result.name].rtcPeer.processAnswer(result.sdpAnswer, function (error) {
        if (error) return console.error(error);
    });
    
}

function callResponse(message) {
    if (message.response != 'accepted') {
        console.info('Call not accepted by peer. Closing call');
        stop();
    } else {
        webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
            if (error) return console.error(error);
        });
    }
}

function onExistingParticipants(msg) {
    var constraints = {
        audio: true,
        video: {
            mandatory: {
                maxWidth: 320,
                maxFrameRate: 15,
                minFrameRate: 15
            }
        }
    };

    console.log(name + " registered in room " + room);
    var participant = new Participant(name);
    participants[name] = participant;
    var video = participant.getVideoElement();

    const $tempVideo = document.querySelector('#local-video');


    // var options = {
    //     localVideo: video,
    //     mediaConstraints: constraints,
    //     onicecandidate: participant.onIceCandidate.bind(participant)
    // }

    var options = {
        videoStream:  $tempVideo.srcObject,
        mediaConstraints: constraints,
        onicecandidate: participant.onIceCandidate.bind(participant)
    }

    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
        function (error) {
            if (error) {
                return console.error(error);
            }
            this.generateOffer(participant.offerToReceiveVideo.bind(participant));
        });

    msg.data.forEach(receiveVideo);
}

function leaveRoom() {
    sendMessage({
        id: 'leaveRoom'
    });

    for (var key in participants) {
        participants[key].dispose();
    }

    document.getElementById('join').style.display = 'block';
    document.getElementById('room').style.display = 'none';

    ws.close();
}

function receiveVideo(sender) {
    var participant = new Participant(sender);
    participants[sender] = participant;
    var video = participant.getVideoElement();

    var options = {
        remoteVideo: video,
        onicecandidate: participant.onIceCandidate.bind(participant)
    }

    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
        function (error) {
            if (error) {
                return console.error(error);
            }
            this.generateOffer(participant.offerToReceiveVideo.bind(participant));
        });
}

function onParticipantLeft(request) {
    console.log('Participant ' + request.name + ' left');
    var participant = participants[request.name];
    participant.dispose();
    delete participants[request.name];
}

function sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    console.log('Sending message: ' + jsonMessage);
    ws.send(jsonMessage);
}
