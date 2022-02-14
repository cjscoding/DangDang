package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.InterviewQuestionDto;
import com.ssafy.dangdang.domain.dto.WriteInterview;
import com.ssafy.dangdang.service.InterviewBookmarkService;
import com.ssafy.dangdang.service.InterviewQuestionService;
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

import java.util.List;
import java.util.Optional;

import static com.ssafy.dangdang.util.ApiUtils.*;

@RestController
@RequestMapping("/interview")
@RequiredArgsConstructor
@Slf4j
public class InterviewQuestionController {

    private final InterviewQuestionService interviewQuestionService;
    private final InterviewBookmarkService bookmarkService;

    @Operation(summary = "면접 질문 등록")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "면접 질문 등록 성공")
    })
    @PostMapping()
    @PreAuthorize("hasRole('USER')")
    public ApiResult<InterviewQuestionDto> createInterviewQuestion(
            @CurrentUser PrincipalDetails userPrincipal,
            @RequestBody WriteInterview writeInterview){
        InterviewQuestionDto interviewQuestionDto = InterviewQuestionDto.of(writeInterview);
        interviewQuestionDto.setVisable(false);
        InterviewQuestionDto createdQuestion = interviewQuestionService.writeQuestion(userPrincipal.getUser(), interviewQuestionDto);
        return success(createdQuestion);

    }

    @Operation(summary = "모든 면접 질문 조회", description= "Visable이 true이거나 로그인한 유저가 작성한 면접질문들만 조회, 비로그인 시 Visable이 true인 면접 질문만  조회")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "모든 면접 질문 조회 성공")
    })
    @GetMapping()
    public ApiResult<Page<InterviewQuestionDto>> getAllVisableInterviewQustion(@CurrentUser PrincipalDetails userPrincipal,
                                                                               @ParameterObject Pageable pageable){
        User writer = null;
        if (userPrincipal != null) writer = userPrincipal.getUser();
        return success(interviewQuestionService.getAllVisableInterviewQustion(writer, pageable));
    }

    @Operation(summary = "면접 질문 검색", description= "카테고리, 제목, 내용을 이용하여 검색, 파라미터에 담지 않는 값은 적용되지 않음")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "면접 질문 검색 성공")
    })
    @GetMapping("/search")
    public ApiResult<Page<InterviewQuestionDto>> searchInterviewQuestion(@CurrentUser PrincipalDetails userPrincipal,
                                                                         @ParameterObject WriteInterview searchParam,
                                                                               @ParameterObject Pageable pageable){
        log.info("searchParam: {}",searchParam);
        User writer = null;
        if (userPrincipal != null) writer = userPrincipal.getUser();
        return success(interviewQuestionService.searchInterviewQuestion(writer, searchParam, pageable));
    }

    @Operation(summary = "내가 등록한 면접 질문만 조회", description = "visable 값에 상관없이, 내가 작성한 질문들 조회")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "내가 등록한 면접 질문만 조회 성공")
    })
    @GetMapping("/mine")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<Page<InterviewQuestionDto>> getMyQuestion(@CurrentUser PrincipalDetails userPrincipal,
                                                               @ParameterObject WriteInterview searchParam,
                                                               @ParameterObject Pageable pageable){
        return success(interviewQuestionService.getMyQuestion(userPrincipal.getUser(), searchParam, pageable));
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
    @PatchMapping("/{interviewQuestionId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<InterviewQuestionDto> updateInterviewQuestion(
            @CurrentUser PrincipalDetails userPrincipal,
            @PathVariable Long interviewQuestionId,
            @RequestBody WriteInterview writeInterview){
        Optional<InterviewQuestion> question = interviewQuestionService.findById(interviewQuestionId);
        if(!question.isPresent()) throw new NullPointerException("없는 질문 입니다");
        InterviewQuestionDto interviewQuestionDto = InterviewQuestionDto.of(writeInterview);
        interviewQuestionDto.setId(interviewQuestionId);
        interviewQuestionDto.setVisable(false);
        InterviewQuestionDto createdQuestion = interviewQuestionService.writeQuestion(userPrincipal.getUser(), interviewQuestionDto);
        return success(createdQuestion);

    }

    @Operation(summary = "면접 질문 북마크 등록")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "면접 질문 북마크 등록 성공")
    })
    @PostMapping("/bookmark/{interviewId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<String> makeBookmark(
            @CurrentUser PrincipalDetails userPrincipal,
            @PathVariable Long interviewId){
      bookmarkService.makeBookmark(userPrincipal.getUser(), interviewId);
        return success("Bookmark 등록 성공!");

    }

    @Operation(summary = "면접 질문 북마크 삭제")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "면접 질문 북마크 삭제 성공")
    })
    @DeleteMapping("/bookmark/{interviewId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<String> deleteBookmark(
            @CurrentUser PrincipalDetails userPrincipal,
            @PathVariable Long interviewId){
        bookmarkService.delete(userPrincipal.getUser(), interviewId);
        return success("Bookmark 삭제 성공!");
    }

    @Operation(summary = "면접 질문 북마크 조회")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "면접 질문 북마크 조회 성공")
    })
    @GetMapping("/bookmark")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<Page<InterviewQuestionDto>> getBookmarks(
            @CurrentUser PrincipalDetails userPrincipal,
            @ParameterObject Pageable pageable){
        Page<InterviewQuestionDto> interviewBookmarks = bookmarkService.getInterviewBookmarks(userPrincipal.getUser(), pageable);
        return success(interviewBookmarks);
    }

}
