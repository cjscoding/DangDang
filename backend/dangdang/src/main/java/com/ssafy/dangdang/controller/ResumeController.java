package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.dto.*;
import com.ssafy.dangdang.domain.types.CommentType;
import com.ssafy.dangdang.service.CommentService;
import com.ssafy.dangdang.service.ResumeService;
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

import static com.ssafy.dangdang.util.ApiUtils.*;


@RestController
@RequestMapping("/resume")
//@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final ResumeService resumeService;
    private final CommentService commentService;

    @Operation(summary = "자소서 조회")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "자소서 조회 성공")
    })
    @GetMapping("/{userId}")
    public ApiResult<List<ResumeDto>> getResumes(@PathVariable Long userId,@ParameterObject Pageable pageable){
        List<ResumeDto> resumes = resumeService.getResumes(userId);
        for (ResumeDto resumeDto : resumes){
            Page<CommentDto> comments = commentService.findCommentByReferenceIdWithPage(resumeDto.getId(), CommentType.RESUME,pageable);
            resumeDto.setCommentDtos(comments);
        }

        System.out.println(resumes);
        return success(resumes);
    }

    @Operation(summary = "자소서 작성", description = "Id값은 모두 입력하지 않아도 됨, 또한 입력해도 무시됨")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "자소서 작성 성공")
    })
    @PostMapping()
    @PreAuthorize("hasRole('USER')")
    public ApiResult<ResumeDto> writeResume(@CurrentUser PrincipalDetails userPrincipal,
                                            @RequestBody WriteResume writeResume){
        ResumeDto resumeDto = ResumeDto.of(writeResume);
        ResumeDto newResume = ResumeDto.of(resumeService.writeResume(userPrincipal.getUser(),
                resumeDto.getResumeQuestionList()));
        return success(newResume);
    }

    // 처음 쓸 때는, ResumeDto에 ID가 필요없지만,
    // 수정할 때는 필요하기 때문에 @Valid옵션을 줌
    @Operation(summary = "자소서 수정", description = "자소서 질문 Id들을 빠짐 없이 입력해야함")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "자소서 수정 성공")
    })
    @PatchMapping("/{resumeId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<ResumeDto> updateResume(@CurrentUser PrincipalDetails userPrincipal,
                                             @PathVariable Long resumeId,
                                             @RequestBody WriteResume writeResume){
        ResumeDto resumeDto = ResumeDto.of(writeResume);
        resumeDto.setId(resumeId);
        ResumeDto newResume = ResumeDto.of(resumeService.updateResume(userPrincipal.getUser(),
                resumeDto));
        return success(newResume);
    }


    @Operation(summary = "자소서 삭제")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "자소서 삭제 성공")
    })
    @DeleteMapping("/{resumeId}")
    @PreAuthorize("hasRole('USER')")
    public  ApiResult<String> deleteResume(@CurrentUser PrincipalDetails userPrincipal, @PathVariable Long resumeId){

            resumeService.deleteResume(userPrincipal.getUser(), resumeId);
        return success("삭제 성공");
    }

    @Operation(summary = "자소서 댓글 등록", description = "parentId는 답글 작성시에만 작성")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "자소서 댓글 등록 성공")
    })
    @PostMapping("/{resumeId}/comment")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<CommentDto> writeComment(@CurrentUser PrincipalDetails userPrincipal,
                                              @PathVariable Long resumeId,
                                              @RequestBody WriteComment writeComment){
        CommentDto commentDto = CommentDto.of(writeComment);
        commentDto.setReferenceId(resumeId);
        commentDto.setCommentType(CommentType.RESUME);
        return success(commentService.writeComment(userPrincipal.getUser(), commentDto));
    }

    @Operation(summary = "자소서 댓글 삭제")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "자소서 댓글 등록 삭제")
    })
    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{resumeId}/comment/{commentId}")
    public ApiResult<String> deleteComment(@CurrentUser PrincipalDetails userPrincipal,
                                           @PathVariable String commentId){
        return commentService.deleteComment(userPrincipal.getUser(), commentId);
    }

    @Operation(summary = "자소서 댓글 수정")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "자소서 댓글 등록 수정")
    })
    @PreAuthorize("hasRole('USER')")
    @PatchMapping("/{resumeId}/comment/{commentId}")
    public ApiResult<CommentDto> updateComment(@CurrentUser PrincipalDetails userPrincipal,
                                               @PathVariable Long resumeId, @PathVariable String commentId,
                                               @RequestBody WriteComment writeComment){
        CommentDto commentDto = CommentDto.of(writeComment);
        commentDto.setId(commentId);
        commentDto.setCommentType(CommentType.RESUME);
        return commentService.updateComment(userPrincipal.getUser(), commentDto);
    }

}
