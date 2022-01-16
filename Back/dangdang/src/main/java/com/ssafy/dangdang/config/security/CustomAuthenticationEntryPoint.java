package com.ssafy.dangdang.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.dangdang.util.ApiUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
        log.error("Responding with unauthorized error. Message - {}", e.getMessage());

        ObjectMapper objectMapper = new ObjectMapper();
        httpServletResponse.setStatus(401);
        httpServletResponse.setContentType("application/json;charset=utf-8");


        PrintWriter out = httpServletResponse.getWriter();
        String jsonResponse = objectMapper.writeValueAsString(ApiUtils.error("로그인에 실패했습니다.", HttpStatus.UNAUTHORIZED));
        out.print(jsonResponse);
    }
}
