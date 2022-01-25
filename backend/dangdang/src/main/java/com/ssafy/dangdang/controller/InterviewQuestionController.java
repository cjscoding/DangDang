package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.domain.dto.InterviewQuestionDto;
import com.ssafy.dangdang.service.InterviewQuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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

    @PostMapping()
    public ApiResult<InterviewQuestionDto> createInterviewQuestion(
            @CurrentUser PrincipalDetails userPrincipal,
            @RequestBody InterviewQuestionDto interviewQuestionDto){

        InterviewQuestionDto createdQuestion = interviewQuestionService.writeQuestion(userPrincipal.getUser(), interviewQuestionDto);
        return success(createdQuestion);

    }

    @GetMapping()
    public ApiResult<List<InterviewQuestionDto>> getAllInterviewQuestion(){
        return success(interviewQuestionService.getAllInterviewQustion());
    }

    @DeleteMapping("/{interviewQuestionId}")
    public ApiResult<String> deleteInterviewQuestion(
            @CurrentUser PrincipalDetails userPrincipal,
            @PathVariable Long interviewQuestionId){
        return interviewQuestionService.deleteQuestion(userPrincipal.getUser(), interviewQuestionId);
    }

    @PatchMapping()
    public ApiResult<InterviewQuestionDto> updateInterviewQuestion(
            @CurrentUser PrincipalDetails userPrincipal,
            @RequestBody InterviewQuestionDto interviewQuestionDto){
        Optional<InterviewQuestion> question = interviewQuestionService.findById(interviewQuestionDto.getId());
        if(!question.isPresent()) return (ApiResult<InterviewQuestionDto>) error("없는 질문 입니다.", HttpStatus.NOT_FOUND);
        InterviewQuestionDto createdQuestion = interviewQuestionService.writeQuestion(userPrincipal.getUser(), interviewQuestionDto);
        return success(createdQuestion);

    }

}
