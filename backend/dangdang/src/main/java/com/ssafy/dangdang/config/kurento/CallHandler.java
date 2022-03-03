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

package com.ssafy.dangdang.config.kurento;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.ssafy.dangdang.domain.User;
import org.kurento.client.IceCandidate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * 
 * @author Ivan Gracia (izanmail@gmail.com)
 * @since 4.3.1
 */
public class CallHandler extends TextWebSocketHandler {

  private static final Logger log = LoggerFactory.getLogger(CallHandler.class);

  private static final Gson gson = new GsonBuilder().create();

  @Autowired
  private RoomManager roomManager;

  @Autowired
  private UserRegistry registry;

  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    final JsonObject jsonMessage = gson.fromJson(message.getPayload(), JsonObject.class);

    final UserSession user = registry.getBySession(session);

    if (user != null) {
      log.debug("Incoming message from user '{}': {}", user.getName(), jsonMessage);
    } else {
      log.debug("Incoming message from new user: {}", jsonMessage);
    }

    switch (jsonMessage.get("id").getAsString()) {
      case "joinRoom":
        joinRoom(jsonMessage, session);
        break;
      case "receiveVideoFrom":
        final String senderName = jsonMessage.get("sender").getAsString();
        final UserSession sender = registry.getByName(senderName);
        final String sdpOffer = jsonMessage.get("sdpOffer").getAsString();
        user.receiveVideoFrom(sender, sdpOffer);
        break;
      case "leaveRoom":
        leaveRoom(user);
        break;
      case "onIceCandidate":
        JsonObject candidate = jsonMessage.get("candidate").getAsJsonObject();

        if (user != null) {
          IceCandidate cand = new IceCandidate(candidate.get("candidate").getAsString(),
              candidate.get("sdpMid").getAsString(), candidate.get("sdpMLineIndex").getAsInt());
          user.addCandidate(cand, jsonMessage.get("name").getAsString());
        }
        break;
      case "chat":
        sendMsg(user, jsonMessage, session);
        break;
      case "mode":
        sendMode(user, jsonMessage, session);
        break;
//      case "members":
//        // session이 없으므로 새로 만들어줌
//        sendMembers(jsonMessage, session);
//        break;
      default:
        break;
    }
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    UserSession user = registry.removeBySession(session);
    if(user != null)
    roomManager.getRoom(user.getRoomName()).leave(user);
  }

  private void joinRoom(JsonObject params, WebSocketSession session) throws IOException {
    final String roomName = params.get("room").getAsString();
    final String name = params.get("name").getAsString();
    log.info("PARTICIPANT {}: trying to join room {}", name, roomName);

    Room room = roomManager.getRoom(roomName);
    // 같은 이름 중복 확인 작업
    for(UserSession s : room.getParticipants()){
      if(s.getName().equals(name)){
        log.info("------------같은 이름 있음---------");
        final JsonObject newMsg = new JsonObject();
        newMsg.addProperty("id", "duplicateName");
        session.sendMessage(new TextMessage(newMsg.toString()));
        return;
      }
    }
    final UserSession user = room.join(name, session);
    registry.register(user); // user 생성해서 저장
  }

  private void leaveRoom(UserSession user) throws IOException {
    final Room room = roomManager.getRoom(user.getRoomName());
    room.leave(user);
    if (room.getParticipants().isEmpty()) {
      roomManager.removeRoom(room);
    }
  }

  private void sendMsg(UserSession user, JsonObject params, WebSocketSession session) throws IOException {
    String contents = params.get("contents").getAsString(); // 보내야 할 메세지
    log.info("문자 보낸 세션:" + session + " : " + contents);

    // 세션이 포함되어있는 룸 찾고, 룸안에 있는 모든 참여자들에게 메세지 보냄
    Room room=roomManager.getRoom(user.getRoomName());
    room.roomSendMsg(session, user, contents);
  }

  private void sendMode(UserSession user, JsonObject params, WebSocketSession session) throws IOException {
    String position = params.get("position").getAsString(); // 보내야 할 메세지
    log.info("mode 보낸 세션:" + session + " : " + position);

    // 세션이 포함되어있는 룸 찾고, 룸안에 있는 모든 참여자들에게 메세지 보냄
    Room room=roomManager.getRoom(user.getRoomName());
    room.roomSendMode(session, user, position);
  }

  // roomName에 포함된 모든 멤버들 return
//  private void sendMembers(JsonObject params, WebSocketSession session) throws IOException {
//    String roomName = params.get("roomName").getAsString(); // 보내야 할 메세지
//    String name = params.get("name").getAsString(); // 보내야 할 메세지
//    log.info("roomName 보낸 세션:" + session + " : " + roomName);
//
////    // 임시 방 만들어서 거기서 처리해줌
////    Room room = roomManager.getRoom("tempRoom");
////    final UserSession user = room.join(session.getId(), session);
////    registry.register(user); // user 생성해서 저장
//
//    UserSession user=new UserSession(name,"temp",session,null);
//    registry.register(user);
//    // roomName과 같은 room 찾고, session에게 roomName에 포함된 멤버 정보 보냄
//    Room room=roomManager.getRoom(roomName);
//    room.roomSendMembers(session, user, roomName);
//
//    // 멤버 정보 보내고 임시 방 나감
//    leaveRoom(user);
//
//  }


}
