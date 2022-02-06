package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.Post;
import com.ssafy.dangdang.domain.dto.CommentDto;
import com.ssafy.dangdang.domain.dto.PostDto;
import com.ssafy.dangdang.domain.dto.WriteComment;
import com.ssafy.dangdang.domain.dto.WritePost;
import com.ssafy.dangdang.domain.types.CommentType;
import com.ssafy.dangdang.service.CommentService;
import com.ssafy.dangdang.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static com.ssafy.dangdang.util.ApiUtils.*;

@RestController
@RequestMapping("/study")
//@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class PostController {


    private final PostService postService;
    private final CommentService commentService;

    @Operation(summary = "게시글 상세 조회")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "게시글 상세 조회 성공")
    })
    @GetMapping("/{studyId}/post/{postId}")
    public ApiResult<PostDto> getPost(@CurrentUser PrincipalDetails userPrincipal,
                                        @PathVariable Long postId, @ParameterObject Pageable pageable){
        Page<CommentDto> comments = commentService.findCommentByReferenceIdWithPage(postId, CommentType.POST,pageable);
        PostDto postDto = postService.findPostDtoById(postId);
        postDto.setComments(comments);
        return success(postDto);

    }
    @Operation(summary = "스터디 게시글 전체 조회")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "게시글 전체 조회 성공")
    })
    @GetMapping("/{studyId}/post")
    public ApiResult<Page<PostDto>> getAllPost(@CurrentUser PrincipalDetails userPrincipal,
                                              @PathVariable Long studyId, @ParameterObject  Pageable pageable){
        return success(postService.getAllPost(studyId, pageable));

    }

    @Operation(summary = "게시글 작성")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "게시글 작성")
    })
    @PostMapping("/{studyId}/post")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<PostDto> writePost(@CurrentUser PrincipalDetails userPrincipal,
                                              @PathVariable Long studyId, @RequestBody WritePost writePost){
        PostDto postDto = PostDto.of(writePost);
        return postService.writePost(userPrincipal.getUser(), postDto, studyId);
    }


    @Operation(summary = "게시글 삭제")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "게시글 삭제")
    })
    @DeleteMapping("/{studyId}/post/{postId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<String> deletePost(@CurrentUser PrincipalDetails userPrincipal,
                                              @PathVariable Long postId){
        return postService.deletePost(userPrincipal.getUser(), postId);
    }

    @Operation(summary = "게시글 수정")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "게시글 수정")
    })
    @PatchMapping("/{studyId}/post/{postId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<Post> updatePost(@CurrentUser PrincipalDetails userPrincipal,
                                              @PathVariable Long studyId, @PathVariable Long postId, @RequestBody WritePost writePost){

        Optional<Post> post = postService.findById(postId);
        if (!post.isPresent()) error("없는 게시글 입니다.", HttpStatus.NOT_FOUND);
        PostDto postDto = PostDto.of(writePost);
        postDto.setId(postId);
        return postService.updatePost(userPrincipal.getUser(), postDto, studyId);
    }

    @Operation(summary = "게시글 댓글 등록", description = "parentId는 답글 작성시에만 작성")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "게시글 댓글 등록 성공")
    })
    @PostMapping("/{studyId}/post/{postId}/comment")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<CommentDto> writeComment(@CurrentUser PrincipalDetails userPrincipal,
                                              @PathVariable Long postId,
                                              @RequestBody WriteComment writeComment){
        CommentDto commentDto = CommentDto.of(writeComment);
        commentDto.setReferenceId(postId);
        commentDto.setCommentType(CommentType.POST);
        return success(commentService.writeComment(userPrincipal.getUser(), commentDto));

    }

    @Operation(summary = "게시글 댓글 삭제")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "게시글 댓글 등록 삭제")
    })
    @DeleteMapping("/{studyId}/post/{postId}/comment/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<String> deleteComment(@CurrentUser PrincipalDetails userPrincipal,
                                           @PathVariable String commentId){
        return commentService.deleteComment(userPrincipal.getUser(), commentId);
    }


    @Operation(summary = "게시글 댓글 수정")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "게시글 댓글 등록 수정")
    })
    @PatchMapping("/{studyId}/post/{postId}/comment/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<CommentDto> updateComment(@CurrentUser PrincipalDetails userPrincipal,
                                               @PathVariable Long postId, @PathVariable String commentId,
                                               @RequestBody WriteComment writeComment){
        CommentDto commentDto = CommentDto.of(writeComment);
        commentDto.setId(commentId);
        commentDto.setCommentType(CommentType.POST);
        return commentService.updateComment(userPrincipal.getUser(), commentDto);
    }


}
