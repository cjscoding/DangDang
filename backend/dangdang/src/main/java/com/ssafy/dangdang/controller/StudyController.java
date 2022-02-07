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
import com.ssafy.dangdang.service.StorageService;
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
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import static com.ssafy.dangdang.util.ApiUtils.*;

@RestController
@RequestMapping("/study")
//@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class StudyController {

    private final StudyService studyService;
    private final CommentService commentService;

    private final StorageService storageService;

    @Operation(summary = "스터디 조회", description = "개설된 모든 스터디를 요청한 페이지 만큼 조회, 서버 과부화 예방을 위해 댓글은 조회되지 않습니다.")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 조회 성공")
    })
    @GetMapping()
    public ApiResult<Page<StudyDto>> getAllStudies(@RequestParam(required = false)
                                                       @Parameter(description = "해쉬태그를 이용해서 검색할 시 적용")
                                                               List<String> hashtags,
                                                   @ParameterObject Pageable pageable){
        Page<StudyDto> allStudies = studyService.getAllStudies(hashtags, pageable);

        return  success(allStudies);
    }

    @Operation(summary = "스터디 단일 조회")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 단일 조회 성공")
    })
    @GetMapping("/{studyId}")
    public ApiResult<StudyDto> getStudy(@Parameter(description = "조회할 스터디 id", example = "1") @PathVariable Long studyId,
                                        @ParameterObject Pageable pageable){

        StudyDto studyWithUsers = studyService.findStudyWithUsers(studyId);
        Page<CommentDto> commentDtos = commentService.findCommentByReferenceIdWithPage(studyId, CommentType.STUDY, pageable);
        studyWithUsers.setCommentDtos(commentDtos);
        return  success(studyWithUsers);
    }


    @Operation(summary = "스터디 만들기")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 만들기 성공")
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
            @ApiResponse(responseCode = "200", description = "스터디 정보 수정")
    })
//    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.PUT})
    @PatchMapping("/{studyId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<StudyDto> updateStudy(@CurrentUser PrincipalDetails userPrincipal,
            @Parameter(description = "수정할 스터디 id", example = "1")  @PathVariable Long studyId,
            @RequestBody @Valid MakeStudy makeStudy){
        log.info("=======================================");
        log.info("스터디 수정");
        log.info("=======================================");
        User user = userPrincipal.getUser();
        log.info(user.toString());
        StudyDto studyDto = StudyDto.of(makeStudy);
        studyDto.setId(studyId);
        StudyDto study = studyService.updateStudy(user, studyDto);
        return success(study);
    }

    @Operation(summary = "스터디 삭제", description = "스터디장만이 스터디를 삭제할 수 있습니다.")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 삭제 성공")
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
            @ApiResponse(responseCode = "200", description = "스터디 댓글 등록 성공")
    })
    @PostMapping("/{studyId}/comment")
    public ApiResult<CommentDto> writeComment(@CurrentUser PrincipalDetails userPrincipal,
                                              @Parameter(description = "댓글을 등록할 스터디 id", example = "1") @PathVariable Long studyId,
                                              @RequestBody WriteComment writeComment){
        CommentDto commentDto = CommentDto.of(writeComment);
        commentDto.setReferenceId(studyId);
        commentDto.setCommentType(CommentType.STUDY);
        return success(commentService.writeComment(userPrincipal.getUser(), commentDto));
    }

    @Operation(summary = "스터디 댓글 삭제")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 댓글 등록 삭제")
    })
    @DeleteMapping("/{studyId}/comment/{commentId}")
    public ApiResult<String> deleteComment(@CurrentUser PrincipalDetails userPrincipal,
                                           @Parameter(description = "삭제할 댓글 id") @PathVariable String commentId){
        return commentService.deleteComment(userPrincipal.getUser(), commentId);
    }

    @Operation(summary = "스터디 댓글 수정")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 댓글 등록 수정")
    })
    @PatchMapping("/{studyId}/comment/{commentId}")
    public ApiResult<CommentDto> updateComment(@CurrentUser PrincipalDetails userPrincipal,
                                               @Parameter(description = "수정할 댓글 id") @PathVariable String commentId,
                                               @RequestBody WriteComment writeComment){
        CommentDto commentDto = CommentDto.of(writeComment);
        commentDto.setId(commentId);
        commentDto.setCommentType(CommentType.STUDY);
        return commentService.updateComment(userPrincipal.getUser(), commentDto);
    }

    @Operation(summary = "스터디 이미지 등록")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 이미지 등록 성공")
    })
    @PostMapping(value = "/{studyId}/image", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('USER')")
    public ApiResult<String> uploadImage(@CurrentUser PrincipalDetails userPrincipal,
                                         @PathVariable Long studyId,
                                         @Parameter(
                                                 description = "업로드할 이미지",
                                                 content = @Content(mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE)  // Won't work without OCTET_STREAM as the mediaType.
                                         )@RequestParam("image")  MultipartFile image) throws IOException {
        log.info("스터디 image 등록 {}", image.getOriginalFilename());
        UUID uuid = UUID.randomUUID();
        storageService.imageStore(uuid.toString(), image);
        studyService.uploadImage(userPrincipal.getUser(), studyId,  uuid.toString(), image);
        return success("등록 성공");
    }

    @Operation(summary = "스터디 이미지 수정")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 이미지 수정 성공")
    })
    @PatchMapping(value = "/{studyId}/image", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('USER')")
    public ApiResult<String> updateImage(@CurrentUser PrincipalDetails userPrincipal,
                                         @PathVariable Long studyId,
                                         @Parameter(
                                                 description = "수정될 이미지",
                                                 content = @Content(mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE)  // Won't work without OCTET_STREAM as the mediaType.
                                         ) MultipartFile image) throws IOException {

        String studyImageUrl = studyService.getImageUrl(studyId);
        if(studyImageUrl != null) storageService.deleteImage(studyImageUrl);

        log.info("스터디 image 수정 {}", image.getOriginalFilename());
        UUID uuid = UUID.randomUUID();
        storageService.imageStore(uuid.toString(), image);
        studyService.uploadImage(userPrincipal.getUser(), studyId, uuid.toString(), image);
        return success("수정 성공");
    }
}
