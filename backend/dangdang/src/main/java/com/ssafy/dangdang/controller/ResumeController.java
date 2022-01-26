package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.dto.CommentDto;
import com.ssafy.dangdang.domain.dto.DeleteRequest;
import com.ssafy.dangdang.domain.dto.ResumeDto;
import com.ssafy.dangdang.domain.projection.ResumeMapping;
import com.ssafy.dangdang.domain.types.CommentType;
import com.ssafy.dangdang.service.CommentService;
import com.ssafy.dangdang.service.ResumeService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.util.List;
import java.util.Optional;

import static com.ssafy.dangdang.util.ApiUtils.*;


@RestController
@RequestMapping("/resume")
@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final ResumeService resumeService;
    private final CommentService commentService;
    private final String pageExample = "{ \"page\" : 0, \"size\" : 10, \"sort\" : [\"id\"] }";

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

    @PostMapping()
    @PreAuthorize("hasRole('USER')")
    public ApiResult<ResumeDto> writeResume(@CurrentUser PrincipalDetails userPrincipal, @RequestBody ResumeDto resumeDto){
        ResumeDto newResume = ResumeDto.of(resumeService.writeResume(userPrincipal.getUser(),
                resumeDto.getResumeQuestionList()));
        return success(newResume);
    }

    // 처음 쓸 때는, ResumeDto에 ID가 필요없지만,
    // 수정할 때는 필요하기 때문에 @Valid옵션을 줌
    @PatchMapping()
    @PreAuthorize("hasRole('USER')")
    public ApiResult<ResumeDto> updateResume(@CurrentUser PrincipalDetails userPrincipal, @RequestBody @Valid ResumeDto resumeDto){
        ResumeDto newResume = ResumeDto.of(resumeService.updateResume(userPrincipal.getUser(),
                resumeDto));
        return success(newResume);
    }

    @DeleteMapping("/{resumeId}")
    @PreAuthorize("hasRole('USER')")
    public  ApiResult<String> deleteResume(@CurrentUser PrincipalDetails userPrincipal, @PathVariable Long resumeId){

            resumeService.deleteResume(userPrincipal.getUser(), resumeId);
        return success("삭제 성공");
    }

    @PostMapping("/{resumeId}/comment")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<CommentDto> writeComment(@CurrentUser PrincipalDetails userPrincipal,
                                              @PathVariable Long resumeId, @RequestBody CommentDto commentDto){
        commentDto.setReferenceId(resumeId);
        commentDto.setCommentType(CommentType.RESUME);
        return success(commentService.writeComment(userPrincipal.getUser(), commentDto));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{resumeId}/comment/{commentId}")
    public ApiResult<String> deleteComment(@CurrentUser PrincipalDetails userPrincipal,
                                           @PathVariable String commentId){
        return commentService.deleteComment(userPrincipal.getUser(), commentId);
    }
    @PreAuthorize("hasRole('USER')")
    @PatchMapping("/{resumeId}/comment/{commentId}")
    public ApiResult<CommentDto> updateComment(@CurrentUser PrincipalDetails userPrincipal,
                                               @PathVariable Long resumeId, @PathVariable String commentId, @RequestBody CommentDto commentDto){
        commentDto.setId(commentId);
        commentDto.setCommentType(CommentType.RESUME);
        return commentService.updateComment(userPrincipal.getUser(), commentDto);
    }

}
