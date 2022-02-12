package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.domain.dto.InterviewQuestionDto;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.service.InterviewQuestionService;
import com.ssafy.dangdang.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.ssafy.dangdang.util.ApiUtils.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserService userService;
    private final InterviewQuestionService interviewQuestionService;

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
    public ApiResult<String> raiseToManager(@PathVariable Long userId){
        userService.raiseToManager(userId);
        return success("권한 승격 성공");
   }

    @Operation(summary = "모든 면접 질문 조회")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "모든 면접 질문 조회 성공")
    })
    @GetMapping("/interview")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ApiResult<Page<InterviewQuestionDto>> getAllInterviewQustion( @ParameterObject Pageable pageable){
        return success(interviewQuestionService.getAllInterviewQustion(pageable));
    }

    @Operation(summary = "면접 질문 공개 허용")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "면접 질문 공개 허용 성공")
    })
    @PatchMapping("/interview/{interviewId}/makePublic")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ApiResult<String> makePublic(@PathVariable Long interviewId){
        interviewQuestionService.makePublic(interviewId);
        return success("면접 질문 공개 허용");
    }

    @Operation(summary = "면접 질문 공개 비허용")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "면접 질문 공개 비허용 성공")
    })
    @PatchMapping("/interview/{interviewId}/hide")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ApiResult<String> hide(@PathVariable Long interviewId){
        interviewQuestionService.hide(interviewId);
        return success("면접 질문 공개 허용");
    }


}
