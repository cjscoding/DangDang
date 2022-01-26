package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.CommentDto;
import com.ssafy.dangdang.domain.dto.MakeStudy;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.domain.dto.WriteComment;
import com.ssafy.dangdang.domain.types.CommentType;
import com.ssafy.dangdang.domain.types.UserRoleType;
import com.ssafy.dangdang.service.CommentService;
import com.ssafy.dangdang.service.StudyService;
import com.ssafy.dangdang.util.ApiUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.util.List;

import static com.ssafy.dangdang.util.ApiUtils.*;

@RestController
@RequestMapping("/study")
@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class StudyController {

    private final StudyService studyService;
    private final CommentService commentService;


    @Operation(summary = "스터디 조회", description = "개설된 모든 스터디를 요청한 페이지 만큼 조회, 서버 과부화 예방을 위해 댓글은 조회되지 않습니다.")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 파라미터 요청", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError400.class))),
            @ApiResponse(responseCode = "500", description = "서버 API 에러", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError500.class)))
    })
    @GetMapping()
    public ApiResult<Page<StudyDto>> getAllStudies(@ParameterObject Pageable pageable){
        Page<StudyDto> allStudies = studyService.getAllStudies(pageable);

        return  success(allStudies);
    }

    @Operation(summary = "스터디 단일 조회")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 단일 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 파라미터 요청", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError400.class))),
            @ApiResponse(responseCode = "500", description = "서버 API 에러", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError500.class)))
    })
    @GetMapping("/{studyId}")
    public ApiResult<StudyDto> getStudy(@Parameter(description = "조회할 스터디 id", example = "1") @PathVariable Long studyId, @ParameterObject Pageable pageable){

        StudyDto studyWithUsers = studyService.findStudyWithUsers(studyId);
        Page<CommentDto> commentDtos = commentService.findCommentByReferenceIdWithPage(studyId, CommentType.STUDY, pageable);
        studyWithUsers.setCommentDtos(commentDtos);
        return  success(studyWithUsers);
    }


    @Operation(summary = "스터디 만들기")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 만들기 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 파라미터 요청", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError400.class))),
            @ApiResponse(responseCode = "500", description = "서버 API 에러", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError500.class)))
    })
    @PostMapping()
    @PreAuthorize("hasRole('USER')")
    public ApiResult<StudyDto> createStudy(@CurrentUser PrincipalDetails userPrincipal
            ,@RequestBody @Valid MakeStudy makeStudy){

        User user = userPrincipal.getUser();
        log.info(user.toString());
        StudyDto study = studyService.createStudy(user, StudyDto.of(makeStudy));
        return success(study);

    }


    @Operation(summary = "스터디 정보 수정")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 정보 수정"),
            @ApiResponse(responseCode = "400", description = "잘못된 파라미터 요청", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError400.class))),
            @ApiResponse(responseCode = "500", description = "서버 API 에러", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError500.class)))
    })
    @PatchMapping("/{studyId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<StudyDto> updateStudy(@CurrentUser PrincipalDetails userPrincipal,
            @Parameter(description = "수정할 스터디 id", example = "1")  @PathVariable Long studyId,
            @RequestBody @Valid MakeStudy makeStudy){

        User user = userPrincipal.getUser();
        log.info(user.toString());
        StudyDto studyDto = StudyDto.of(makeStudy);
        studyDto.setId(studyId);
        StudyDto study = studyService.updateStudy(user, studyDto);
        return success(study);

    }

    @Operation(summary = "스터디 삭제", description = "스터디장만이 스터디를 삭제할 수 있습니다.")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 파라미터 요청", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError400.class))),
            @ApiResponse(responseCode = "500", description = "서버 API 에러", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError500.class)))
    })
    @DeleteMapping("/{studyId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<String> deleteStudy(@CurrentUser PrincipalDetails userPrincipal
            ,@Parameter(description = "삭제할 스터디 id", example = "1")  @PathVariable Long studyId){
        User user = userPrincipal.getUser();
        return studyService.deleteStudy(user, studyId);

    }

    @Operation(summary = "스터디 댓글 등록", description = "parentId는 답글 작성시에만 작성")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 댓글 등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 파라미터 요청", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError400.class))),
            @ApiResponse(responseCode = "500", description = "서버 API 에러", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError500.class)))
    })
    @PostMapping("/{studyId}/comment")
    public ApiResult<CommentDto> writeComment(@CurrentUser PrincipalDetails userPrincipal,
                                              @Parameter(description = "댓글을 등록할 스터디 id", example = "1") @PathVariable Long studyId, @RequestBody WriteComment writeComment){
        CommentDto commentDto = CommentDto.of(writeComment);
        commentDto.setReferenceId(studyId);
        commentDto.setCommentType(CommentType.STUDY);
        return success(commentService.writeComment(userPrincipal.getUser(), commentDto));
    }

    @Operation(summary = "스터디 댓글 삭제")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 댓글 등록 삭제"),
            @ApiResponse(responseCode = "400", description = "잘못된 파라미터 요청", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError400.class))),
            @ApiResponse(responseCode = "500", description = "서버 API 에러", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError500.class)))
    })
    @DeleteMapping("/{studyId}/comment/{commentId}")
    public ApiResult<String> deleteComment(@CurrentUser PrincipalDetails userPrincipal,
                                           @Parameter(description = "삭제할 댓글 id") @PathVariable String commentId){
        return commentService.deleteComment(userPrincipal.getUser(), commentId);
    }

    @Operation(summary = "스터디 댓글 수정")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 댓글 등록 수정"),
            @ApiResponse(responseCode = "400", description = "잘못된 파라미터 요청", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError400.class))),
            @ApiResponse(responseCode = "500", description = "서버 API 에러", content = @Content(schema = @Schema(implementation = ApiUtils.ApiError500.class)))
    })
    @PatchMapping("/{studyId}/comment/{commentId}")
    public ApiResult<CommentDto> updateComment(@CurrentUser PrincipalDetails userPrincipal,
                                               @Parameter(description = "수정할 댓글 id") @PathVariable String commentId, @RequestBody WriteComment writeComment){
        CommentDto commentDto = CommentDto.of(writeComment);
        commentDto.setId(commentId);
        commentDto.setCommentType(CommentType.STUDY);
        return commentService.updateComment(userPrincipal.getUser(), commentDto);
    }

}
