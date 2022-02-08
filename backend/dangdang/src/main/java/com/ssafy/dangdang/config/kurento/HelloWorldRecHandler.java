/*
 * (C) Copyright 2015-2016 Kurento (http://kurento.org/)
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
 */
package com.ssafy.dangdang.config.kurento;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.ssafy.dangdang.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.kurento.client.*;
import org.kurento.jsonrpc.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.InvalidPathException;
import java.util.ArrayList;

/**
 * Hello World with recording handler (application and media logic).
 *
 * @author Boni Garcia (bgarcia@gsyc.es)
 * @author David Fernandez (d.fernandezlop@gmail.com)
 * @author Radu Tom Vlad (rvlad@naevatec.com)
 * @author Ivan Gracia (igracia@kurento.org)
 * @since 6.1.1
 */


public class HelloWorldRecHandler extends TextWebSocketHandler {
  private static String RECORDER_FILE_PATH = "file:///tmp/"+"HelloWorldRecorded.webm"; //default name

  private final Logger log = LoggerFactory.getLogger(HelloWorldRecHandler.class);
  private static final Gson gson = new GsonBuilder().create();
  private Boolean isStop = false;
  @Autowired
  private UserRegistry registry;

  @Autowired
  private StorageService storageService;

  @Autowired
  private KurentoClient kurento;

  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    JsonObject jsonMessage = gson.fromJson(message.getPayload(), JsonObject.class);
    log.debug("Incoming message: {}", jsonMessage);

    UserSession user = registry.getBySession(session);

    log.info("============================================================");
    log.info("session id :{}",user);
    log.info("============================================================");
    if (user != null) {
      log.debug("Incoming message from user '{}': {}", user.getId(), jsonMessage);
    } else {
      log.debug("Incoming message from new user: {}", jsonMessage);
    }

    switch (jsonMessage.get("id").getAsString()) {
      case "start":
        log.debug("start");
        String saveName=jsonMessage.get("name").getAsString(); //프론트로부터 받은 저장 파일 이름
        RECORDER_FILE_PATH = "file:///tmp/"+session.getId()+saveName+".webm"; // user session id+지정한 이름.webm
        start(session, saveName, jsonMessage);
        break;
      case "stop":
        if (user != null) {
          user.stop();
          isStop = true;
          log.debug("stop");
        }
      case "stopPlay":
        if (user != null) {
          user.release();
          log.debug("stopPlay");
        }
        break;
      case "play":
        play(user, session, jsonMessage);
        log.debug("play");
        break;
      case "onIceCandidate": {
        JsonObject jsonCandidate = jsonMessage.get("candidate").getAsJsonObject();

        if (user != null && !isStop) {
          IceCandidate candidate = new IceCandidate(jsonCandidate.get("candidate").getAsString(),
                  jsonCandidate.get("sdpMid").getAsString(),
                  jsonCandidate.get("sdpMLineIndex").getAsInt());
          user.addCandidate(candidate);
        }
        if(isStop) isStop = false;
        break;
      }
      case "del": 
        log.debug("del");
        if (user != null) {
          del(user);
        }
        break;
      default:
        sendError(session, "Invalid message with id " + jsonMessage.get("id").getAsString());
        break;
    }
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    super.afterConnectionClosed(session, status);
    registry.removeBySession(session);
  }

  // start 누름 -> 녹화 시작
  private void start(final WebSocketSession session, String saveName, JsonObject jsonMessage) {
    try {
      log.info("녹화될 영상 name 확인 :: {}",RECORDER_FILE_PATH);
      // 1. Media logic (webRtcEndpoint in loopback)
      MediaPipeline pipeline = kurento.createMediaPipeline();
      WebRtcEndpoint webRtcEndpoint = new WebRtcEndpoint.Builder(pipeline).build();
      webRtcEndpoint.connect(webRtcEndpoint);

      // MediaProfileSpecType :: 미디어 프로필. 현재 WEBM, MKV, MP4 및 JPEG가 지원됩니다.
      // 비디오, 오디오, 비디오&오디오 중 뭐 선택할지
      // https://doc-kurento.readthedocs.io/en/latest/_static/client-javadoc/org/kurento/client/MediaProfileSpecType.html
      MediaProfileSpecType profile = getMediaProfileFromMessage(jsonMessage);

      //recorder
      // 미디어 콘텐츠를 저장하는 기능을 제공합니다.
      // RecorderEndpoint는 미디어를 로컬 파일에 저장하거나 원격 네트워크 저장소로 보낼 수 있습니다.
      // 다른 하나 MediaElement가 RecorderEndpoint에 연결되면 전자에서 오는 미디어는 선택한 녹화 형식으로 캡슐화되어 지정된 위치에 저장됩니다.
      RecorderEndpoint recorder = new RecorderEndpoint.Builder(pipeline, RECORDER_FILE_PATH)
              .withMediaProfile(profile).build();

      // 2. Store user session
      UserSession user= registry.getById(session.getId());

      if(user == null){
        user = new UserSession(session.getId(),session.getId(),session, pipeline);
        registry.register(user);
      }
      user.setMediaPipeline(pipeline);
      user.setWebRtcEndpoint(webRtcEndpoint);
      user.setRecorderEndpoint(recorder);

//      user.getVideos().add(user.getId()+saveName);
      user.addVideo(user.getId()+saveName); // set 저장
      log.info("지금까지 저장한 파일 이름 :: {}",user.getVideos());

      // 녹화 시작
      recorder.addRecordingListener(new EventListener<RecordingEvent>() {

        @Override
        public void onEvent(RecordingEvent event) {
          JsonObject response = new JsonObject();
          response.addProperty("id", "recording");
          try {
            synchronized (session) {
              session.sendMessage(new TextMessage(response.toString()));
            }
          } catch (IOException e) {
            log.error(e.getMessage());
          }
        }

      });

      recorder.addStoppedListener(new EventListener<StoppedEvent>() {

        @Override
        public void onEvent(StoppedEvent event) {
          JsonObject response = new JsonObject();
          response.addProperty("id", "stopped");
          try {
            synchronized (session) {
              session.sendMessage(new TextMessage(response.toString()));
              log.debug("recoder 저장 확인 {}",recorder);
            }
          } catch (IOException e) {
            log.error(e.getMessage());
          }
        }

      });

      recorder.addPausedListener(new EventListener<PausedEvent>() {

        @Override
        public void onEvent(PausedEvent event) {
          JsonObject response = new JsonObject();
          response.addProperty("id", "paused");
          try {
            synchronized (session) {
              session.sendMessage(new TextMessage(response.toString()));
            }
          } catch (IOException e) {
            log.error(e.getMessage());
          }
        }

      });

      connectAccordingToProfile(webRtcEndpoint, recorder, profile);

      // 3. SDP negotiation
      String sdpOffer = jsonMessage.get("sdpOffer").getAsString();
      String sdpAnswer = webRtcEndpoint.processOffer(sdpOffer);

      // 4. Gather ICE candidates
      webRtcEndpoint.addIceCandidateFoundListener(new EventListener<IceCandidateFoundEvent>() {

        @Override
        public void onEvent(IceCandidateFoundEvent event) {
          JsonObject response = new JsonObject();
          response.addProperty("id", "iceCandidate");
          response.add("candidate", JsonUtils.toJsonObject(event.getCandidate()));
          try {
            synchronized (session) {
              session.sendMessage(new TextMessage(response.toString()));
            }
          } catch (IOException e) {
            log.error(e.getMessage());
          }
        }
      });

      JsonObject response = new JsonObject();
      response.addProperty("id", "startResponse");
      response.addProperty("sdpAnswer", sdpAnswer);
      response.addProperty("sessionId",user.getId());

      synchronized (user) {
        session.sendMessage(new TextMessage(response.toString()));
      }

      webRtcEndpoint.gatherCandidates();

      recorder.record();
    } catch (Throwable t) {
      log.error("Start error", t);
      sendError(session, t.getMessage());
    }
  }

  private MediaProfileSpecType getMediaProfileFromMessage(JsonObject jsonMessage) {

    MediaProfileSpecType profile;
    switch (jsonMessage.get("mode").getAsString()) {
      case "audio-only":
        profile = MediaProfileSpecType.WEBM_AUDIO_ONLY;
        break;
      case "video-only":
        profile = MediaProfileSpecType.WEBM_VIDEO_ONLY;
        break;
      default:
        profile = MediaProfileSpecType.WEBM;
    }

    return profile;
  }

  private void connectAccordingToProfile(WebRtcEndpoint webRtcEndpoint, RecorderEndpoint recorder,
                                         MediaProfileSpecType profile) {
    switch (profile) {
      case WEBM:
        webRtcEndpoint.connect(recorder, MediaType.AUDIO);
        webRtcEndpoint.connect(recorder, MediaType.VIDEO);
        break;
      case WEBM_AUDIO_ONLY:
        webRtcEndpoint.connect(recorder, MediaType.AUDIO);
        break;
      case WEBM_VIDEO_ONLY:
        webRtcEndpoint.connect(recorder, MediaType.VIDEO);
        break;
      default:
        throw new UnsupportedOperationException("Unsupported profile for this tutorial: " + profile);
    }
  }
  // 미디어 요소( WebRtcEndpoint및 PlayerEndpoint)를 사용하여 미디어 파이프라인을 만들고 연결합니다. 그런 다음 녹음된 미디어를 클라이언트로 보냅니다.
  private void play(UserSession user, final WebSocketSession session, JsonObject jsonMessage) {
    try {
      String path=jsonMessage.get("path").getAsString(); // 프론트엔드에서 넘어온 주소
      System.out.println("프론트엔드에서 넘어온 path :: " + path);

      // 1. Media logic
      final MediaPipeline pipeline = kurento.createMediaPipeline();
      WebRtcEndpoint webRtcEndpoint = new WebRtcEndpoint.Builder(pipeline).build();
      PlayerEndpoint player = new PlayerEndpoint.Builder(pipeline, "file:///tmp/"+path).build(); //프론트에서 넘어온 주소를 할당
      player.connect(webRtcEndpoint);

      // Player listeners
      player.addErrorListener(new EventListener<ErrorEvent>() {
        @Override
        public void onEvent(ErrorEvent event) {
          log.info("ErrorEvent for session '{}': {}", session.getId(), event.getDescription());
          sendPlayEnd(session, pipeline);
        }
      });
      player.addEndOfStreamListener(new EventListener<EndOfStreamEvent>() {
        @Override
        public void onEvent(EndOfStreamEvent event) {
          log.info("EndOfStreamEvent for session '{}'", session.getId());
          sendPlayEnd(session, pipeline);
        }
      });

      // 2. Store user session
      user.setMediaPipeline(pipeline);
      user.setWebRtcEndpoint(webRtcEndpoint);

      // SDP는 각 피어간의 Session 정보를 담고 있는 프로토콜이다.
      // 예를 들면, 음성만 전송할 것인지 영상과 함께 다 전송할 것인지, 피어의 네트워크 IP 등... 이를 통해 피어간의 Signaling이 이뤄진다.

      // 3. SDP negotiation
      String sdpOffer = jsonMessage.get("sdpOffer").getAsString();
      String sdpAnswer = webRtcEndpoint.processOffer(sdpOffer);

      JsonObject response = new JsonObject();
      response.addProperty("id", "playResponse");
      response.addProperty("sdpAnswer", sdpAnswer);

      // 4. Gather ICE candidates
      webRtcEndpoint.addIceCandidateFoundListener(new EventListener<IceCandidateFoundEvent>() {

        @Override
        public void onEvent(IceCandidateFoundEvent event) {
          JsonObject response = new JsonObject();
          response.addProperty("id", "iceCandidate");
          response.add("candidate", JsonUtils.toJsonObject(event.getCandidate()));
          try {
            synchronized (session) {
              session.sendMessage(new TextMessage(response.toString()));
            }
          } catch (IOException e) {
            log.error(e.getMessage());
          }
        }
      });

      // 5. Play recorded stream
      System.out.println("녹화된 영상 play================");
      player.play();

      synchronized (session) {
        session.sendMessage(new TextMessage(response.toString()));
      }

      webRtcEndpoint.gatherCandidates();
    } catch (Throwable t) {
      log.error("Play error", t);
      sendError(session, t.getMessage());
    }

  }

  public void sendPlayEnd(WebSocketSession session, MediaPipeline pipeline) {
    try {
      JsonObject response = new JsonObject();
      response.addProperty("id", "playEnd");
      session.sendMessage(new TextMessage(response.toString()));
    } catch (IOException e) {
      log.error("Error sending playEndOfStream message", e);
    }
    // Release pipeline
    pipeline.release();
  }

  private void sendError(WebSocketSession session, String message) {
    try {
      JsonObject response = new JsonObject();
      response.addProperty("id", "error");
      response.addProperty("message", message);
      session.sendMessage(new TextMessage(response.toString()));
    } catch (IOException e) {
      log.error("Exception sending message", e);
    }
  }
  // delete 추가 
  private void del(UserSession user) throws FileNotFoundException {
    log.info("delete 컨트롤러 연결");
    for (String video : user.getVideos()) {
//      String filePath = "/home/ssafy/share/files/"+video+".webm";
      String fileName = video+".webm";
//      log.info("filePath : {}",filePath);
      log.info("fileName : {}",fileName);
      try {
        storageService.deleteVideo(fileName);
      }catch (InvalidPathException e){
          e.printStackTrace();
          log.error("잘못된 경로입니다!");
      }

//      File deleteFile = new File(filePath);
//      // 파일이 존재하는지 체크 존재할경우 true, 존재하지않을경우 false
//      if(deleteFile.exists()) {
//        deleteFile.delete();
//        log.info("파일이 삭제되었습니다.");
//      } else {
//        log.info("파일이 없습니다.");
//      }
    }
    user.getVideos().clear();
    return;
  }
}
