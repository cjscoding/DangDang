package com.ssafy.bori.controller;

import com.ssafy.bori.domain.dto.UserDto;
import com.ssafy.bori.domain.types.Response;
import com.ssafy.bori.service.UserService;
import com.ssafy.bori.util.CookieUtil;
import com.ssafy.bori.util.JwtUtil;
import com.ssafy.bori.util.RedisUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = {"http://localhost:8081","http://118.222.22.199:8081"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    private final RedisUtil redisUtil;

    @PostMapping("/login")
    public Response login(@RequestBody UserDto userDto, HttpServletResponse res) {

        log.info("userDTO"+ userDto.toString());
        try {
            UserDto user = userService.loginUser(userDto.getEmail(), userDto.getPassword());
            final String token= jwtUtil.generateToken(user);
            final String refreshJwt = jwtUtil.generateRefreshToken(user);
            Cookie accessToken = cookieUtil.createCookie(JwtUtil.ACCESS_TOKEN_NAME, token);
            Cookie refreshToken = cookieUtil.createCookie(JwtUtil.REFRESH_TOKEN_NAME, refreshJwt);

            res.addCookie(accessToken);
            res.addCookie(refreshToken);
            return new Response("success", "로그인에 성공했습니다.", token);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response("error", "로그인에 실패했습니다.", e.getMessage());
        }

    }

}
