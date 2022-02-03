package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.dto.InterviewQuestionDto;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.domain.dto.WriteInterview;
import com.ssafy.dangdang.service.UserService;
import com.ssafy.dangdang.util.ApiUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import static com.ssafy.dangdang.util.ApiUtils.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserService userService;

    @Operation(summary = "모든 유저 조회(ADMIN 제외)")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "모든 유저 조회 성공")
    })
    @GetMapping("/user")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResult<Page<UserDto>> findAllExceptAdmin(@ParameterObject Pageable pageable){

        Page<UserDto> allExceptAdmin = userService.findAllExceptAdmin(pageable);
        return success(allExceptAdmin);

    }

    @Operation(summary = "유저 Manager 권한 부여")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "유저 Manager 권한 부여 성공")
    })
    @PatchMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResult<String> raiseToManager(@PathVariable Long userId,
                                                   @ParameterObject Pageable pageable){
        userService.raiseToManager(userId);
        return success("권한 승격 성공");
   }

}
