package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.config.security.auth.PrincipalDetailsService;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.util.ApiUtils;
import com.ssafy.dangdang.util.JwtUtil;
import com.ssafy.dangdang.util.RedisUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/user")
@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final PrincipalDetailsService principalDetailsService;
    private final JwtUtil jwtUtil;
    private final RedisUtil redisUtil;

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ApiUtils.ApiResult<UserDto> getCurrentUser(@CurrentUser PrincipalDetails userPrincipal) {
        User user =  userPrincipal.getUser();
        System.out.println("UserPincipal"+ user.toString());
        return ApiUtils.success(UserDto.of(user));

//        return userRepository.findById(userPrincipal.getId())
//                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }
}
