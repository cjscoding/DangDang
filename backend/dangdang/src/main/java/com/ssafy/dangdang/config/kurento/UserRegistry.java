/*
 * (C) Copyright 2014-2016 Kurento (http://kurento.org/)
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

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

/**
 * Map of users registered in the system. This class has a concurrent hash map to store users, using
 * its name as key in the map.
 *
 * @author Boni Garcia (bgarcia@gsyc.es)
 * @author Micael Gallego (micael.gallego@gmail.com)
 * @since 5.0.0
 */
@Getter
@Setter
public class UserRegistry {
    
    private final ConcurrentHashMap<String, UserSession> usersByName = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, UserSession> usersBySessionId = new ConcurrentHashMap<>();

//  public void register(UserSession user) {
//    usersBySessionId.put(user.getId(), user);
//  }
    
    public void register(UserSession user) {
        usersByName.put(user.getName(), user);
        usersBySessionId.put(user.getSession().getId(), user);
    }
    
    public UserSession getById(String id) {
        return usersBySessionId.get(id);
    }
    
    public UserSession getBySession(WebSocketSession session) {
        return usersBySessionId.get(session.getId());
    }
    
    public UserSession getByName(String name) {
        return usersByName.get(name);
    }
    
    // TODO: id와 name 모두 담는 객체 만들기
//  public boolean exists(String id) {
//    return usersBySessionId.keySet().contains(id);
//  }
    public boolean exists(String name) {
        return usersByName.keySet().contains(name);
    }
    
    public UserSession removeBySession(WebSocketSession session) {
        final UserSession user = getBySession(session);

        if(user == null) return null;
        if (usersByName.containsKey(user.getName()))
            usersByName.remove(user.getName());
        if (usersBySessionId.containsKey(session.getId()))
            usersBySessionId.remove(session.getId());
        return user;
    }
    
}
