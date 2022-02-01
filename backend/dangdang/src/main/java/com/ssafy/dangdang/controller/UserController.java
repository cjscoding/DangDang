package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.config.security.auth.PrincipalDetailsService;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.LoginRequest;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.exception.BadRequestException;
import com.ssafy.dangdang.exception.ExtantUserException;
import com.ssafy.dangdang.service.UserService;
import com.ssafy.dangdang.util.ApiUtils;
import com.ssafy.dangdang.util.JwtUtil;
import com.ssafy.dangdang.util.RedisUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import java.util.Optional;

import static com.ssafy.dangdang.util.ApiUtils.*;

@Tag(name = "user", description = "유저관리 API")
@RestController
@RequestMapping("/user")
//@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final PrincipalDetailsService principalDetailsService;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final RedisUtil redisUtil;

    @Operation(summary = "유저 정보 조회", description = "header에 있는 AuthenticationToken으로," +
            " 로그인한 유저의 정보를 조회합니다. 토큰이 없다면 로그인하는 과정이 필요합니다.")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "회원 조회 성공")
    })
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<UserDto> getCurrentUser(@CurrentUser PrincipalDetails userPrincipal) {
        User user =  userPrincipal.getUser();
        System.out.println("UserPincipal"+ user.toString());

        return success(UserDto.of(user));

    }

    @Operation(summary = "회원가입 요청")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "회원 가입 성공")
    })
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
    @Operation(summary = "회원정보 수정")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "회원 정보 수정 성공")
    })
    @PatchMapping()
    public ApiResult<UserDto> updateUser(@RequestBody @Valid UserDto userDto) {

        log.info("user Update {}", userDto.toString());
        try {
            userService.updateUser(userDto);
            return success(userDto);
        }catch (ExtantUserException e){
            e.printStackTrace();
            return (ApiResult<UserDto>) error(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Operation(summary = "회원 삭제 요청")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "회원 삭제 성공")
    })
    @DeleteMapping()
    public ApiResult<String> deleteUser(@RequestBody UserDto userDto) {

        Optional<User> user = userService.findByEmail(userDto.getEmail());
        if (user.isPresent()){
            log.info("user delete {}", userDto.toString());
            if(userService.deleteUser(user.get(), userDto.getPassword())) return success("유저 삭제 성공");
        }

        throw new BadRequestException("올바른 유저 정보를 입력해주세요");

    }

    @Operation(summary = "로그인 요청")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공")
    })
    @PostMapping("/login")
    public ApiResult<String> login(@RequestBody LoginRequest loginRequest) {
        log.info("Login 요청");
        return success("로그인 성공");
    }

    @Operation(summary = "로그아웃 요청")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "로그아웃 성공")
    })
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/logout")
    public ApiResult<String> logout(@CurrentUser PrincipalDetails userPrincipal, HttpServletRequest request) {
        log.info("Logout 요청");
        redisUtil.deleteData(request.getHeader(JwtUtil.REFRESH_HEADER_STRING));
        return success("로그아웃 성공");
    }

    @GetMapping("/test")
    public void test(){
        throw new NullPointerException();

    }


}

