package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.config.security.auth.PrincipalDetailsService;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.exception.BadRequestException;
import com.ssafy.dangdang.exception.ExtantUserException;
import com.ssafy.dangdang.service.UserService;
import com.ssafy.dangdang.util.JwtUtil;
import com.ssafy.dangdang.util.RedisUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import static com.ssafy.dangdang.util.ApiUtils.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final PrincipalDetailsService principalDetailsService;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final RedisUtil redisUtil;


    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<UserDto> getCurrentUser(@CurrentUser PrincipalDetails userPrincipal) {
        User user =  userPrincipal.getUser();
        System.out.println("UserPincipal"+ user.toString());
        return success(UserDto.of(user));

//        return userRepository.findById(userPrincipal.getId())
//                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }

    @PostMapping()
    public ApiResult<UserDto> signUp(@RequestBody @Valid UserDto userDto) {


        log.info("user SignUp {}", userDto.toString());
        try {
            userService.signUpUser(userDto);
            return success(userDto);
        }catch (ExtantUserException e){
            e.printStackTrace();
            return (ApiResult<UserDto>) error(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PatchMapping()
    public ApiResult<UserDto> updateUser(@RequestBody @Valid UserDto userDto) {


        log.info("user SignUp {}", userDto.toString());
        try {
            userService.signUpUser(userDto);
            return success(userDto);
        }catch (ExtantUserException e){
            e.printStackTrace();
            return (ApiResult<UserDto>) error(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping("/test")
    public ApiResult<UserDto> test(@RequestBody @Valid UserDto userDto) {
        throw new BadRequestException("dd");


    }
}

