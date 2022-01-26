package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.domain.dto.InterviewQuestionDto;
import com.ssafy.dangdang.domain.dto.WriteInterview;
import com.ssafy.dangdang.service.InterviewQuestionService;
import com.ssafy.dangdang.util.ApiUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static com.ssafy.dangdang.util.ApiUtils.*;

@RestController
@RequestMapping("/interview")
@RequiredArgsConstructor
@Slf4j
public class InterviewQuestionController {

    private final InterviewQuestionService interviewQuestionService;


    @Operation(summary = "스터디 조회", description = "개설된 모든 스터디를 요청한 페이지 만큼 조회, 서버 과부화 예방을 위해 댓글은 조회되지 않습니다.")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 조회 성공")
    })
    @PostMapping()
    @PreAuthorize("hasRole('USER')")
    public ApiResult<InterviewQuestionDto> createInterviewQuestion(
            @CurrentUser PrincipalDetails userPrincipal,
            @RequestBody WriteInterview writeInterview){
        InterviewQuestionDto interviewQuestionDto = InterviewQuestionDto.of(writeInterview);
        InterviewQuestionDto createdQuestion = interviewQuestionService.writeQuestion(userPrincipal.getUser(), interviewQuestionDto);
        return success(createdQuestion);

    }

    @Operation(summary = "모든 면접 질문 조회")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "모든 면접 질문 조회 성공")
    })
    @GetMapping()
    public ApiResult<List<InterviewQuestionDto>> getAllInterviewQuestion(){
        return success(interviewQuestionService.getAllInterviewQustion());
    }

    @Operation(summary = "면접 질문 삭제")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "면접 질문 삭제 성공")
    })
    @DeleteMapping("/{interviewQuestionId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<String> deleteInterviewQuestion(
            @CurrentUser PrincipalDetails userPrincipal,
            @PathVariable Long interviewQuestionId){
        return interviewQuestionService.deleteQuestion(userPrincipal.getUser(), interviewQuestionId);
    }

    @Operation(summary = "면접 질문 수정")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "면접 질문 수정 성공")
    })
    @PatchMapping()
    @PreAuthorize("hasRole('USER')")
    public ApiResult<InterviewQuestionDto> updateInterviewQuestion(
            @CurrentUser PrincipalDetails userPrincipal,
            @RequestBody WriteInterview writeInterview){
        Optional<InterviewQuestion> question = interviewQuestionService.findById(writeInterview.getId());
        if(!question.isPresent()) throw new NullPointerException("없는 질문 입니다");
        InterviewQuestionDto interviewQuestionDto = InterviewQuestionDto.of(writeInterview);
        InterviewQuestionDto createdQuestion = interviewQuestionService.writeQuestion(userPrincipal.getUser(), interviewQuestionDto);
        return success(createdQuestion);

    }

}
