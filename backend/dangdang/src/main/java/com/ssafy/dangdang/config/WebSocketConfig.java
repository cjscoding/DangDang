package com.ssafy.dangdang.config;

import com.ssafy.dangdang.config.kurento.*;
import org.kurento.client.KurentoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@EnableWebSocket
@Configuration
public class WebSocketConfig implements WebSocketConfigurer {


    @Bean
    public HelloWorldRecHandler handler() {
        return new HelloWorldRecHandler();
    }

    @Bean
    public KurentoClient kurentoClient() {
        return KurentoClient.create();
    }

    @Bean
    public RoomManager roomManager() {
        return new RoomManager();
    }

    @Bean
    public CallHandler groupCallHandler() {
        return new CallHandler();
    }

    @Bean
    public ServletServerContainerFactoryBean createServletServerContainerFactoryBean() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(32768);
        return container;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler(), "/recording").setAllowedOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:80",
                "https://i6c203.p.ssafy.io:3000", "http://i6c203.p.ssafy.io:3000", "https://i6c203.p.ssafy.io:3001",
                "http://i6c203.p.ssafy.io:3001", "https://i6c203.p.ssafy.io:80", "http://i6c203.p.ssafy.io:80",
                "http://i6c203.p.ssafy.io", "https://i6c203.p.ssafy.io").withSockJS();
        registry.addHandler(groupCallHandler(), "/groupcall").setAllowedOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:80",
                "https://i6c203.p.ssafy.io:3000", "http://i6c203.p.ssafy.io:3000", "https://i6c203.p.ssafy.io:3001",
                "http://i6c203.p.ssafy.io:3001", "https://i6c203.p.ssafy.io:80", "http://i6c203.p.ssafy.io:80", "http://i6c203.p.ssafy.io", "https://i6c203.p.ssafy.io").withSockJS();
    }

    @Bean
    public UserRegistry registry() {
        return new UserRegistry();
    }
}
