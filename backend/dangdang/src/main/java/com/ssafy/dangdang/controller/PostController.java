package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.Comment;
import com.ssafy.dangdang.domain.Post;
import com.ssafy.dangdang.domain.dto.CommentDto;
import com.ssafy.dangdang.domain.dto.PostDto;
import com.ssafy.dangdang.service.CommentService;
import com.ssafy.dangdang.service.PostService;
import com.ssafy.dangdang.util.ApiUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static com.ssafy.dangdang.util.ApiUtils.*;

@RestController
@RequestMapping("/study")
@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class PostController {


    private final PostService postService;
    private final CommentService commentService;

    @GetMapping("/{studyId}/post/{postId}")
    public ApiResult<PostDto> getPost(@CurrentUser PrincipalDetails userPrincipal,
                                        @PathVariable Long postId, Pageable pageable){
        Page<CommentDto> comments = commentService.findCommentByPostIdWithPage(postId, pageable);
        PostDto postDto = postService.findPostDtoById(postId);
        postDto.setComments(comments);
        return success(postDto);

    }

    @GetMapping("/{studyId}/post")
    public ApiResult<Page<PostDto>> getAllPost(@CurrentUser PrincipalDetails userPrincipal,
                                              @PathVariable Long studyId, Pageable pageable){
        return success(postService.getAllPost(studyId, pageable));

    }

    @PostMapping("/{studyId}/post")
    public ApiResult<PostDto> writePost(@CurrentUser PrincipalDetails userPrincipal,
                                              @PathVariable Long studyId, @RequestBody PostDto postDto){
        return postService.writePost(userPrincipal.getUser(), postDto, studyId);
    }

    @PostMapping("/{studyId}/post/{postId}/comment")
    public ApiResult<CommentDto> writeComment(@CurrentUser PrincipalDetails userPrincipal,
                                                 @PathVariable Long postId, @RequestBody CommentDto commentDto){
        commentDto.setPostId(postId);
        return success(commentService.writeComment(userPrincipal.getUser(), commentDto));

    }

    @DeleteMapping("/{studyId}/post/{postId}")
    public ApiResult<String> deletePost(@CurrentUser PrincipalDetails userPrincipal,
                                              @PathVariable Long postId){
        return postService.deletePost(userPrincipal.getUser(), postId);
    }

    @DeleteMapping("/{studyId}/post/{postId}/comment/{commentId}")
    public ApiResult<String> deleteComment(@CurrentUser PrincipalDetails userPrincipal,
                                        @PathVariable String commentId){
        return commentService.deleteComment(userPrincipal.getUser(), commentId);
    }

    @PatchMapping("/{studyId}/post/{postId}")
    public ApiResult<Post> updatePost(@CurrentUser PrincipalDetails userPrincipal,
                                              @PathVariable Long studyId, @PathVariable Long postId, @RequestBody PostDto postDto){
        Optional<Post> post = postService.findById(postId);
        if (!post.isPresent()) error("없는 게시글 입니다.", HttpStatus.NOT_FOUND);
        postDto.setId(postId);
        return postService.updatePost(userPrincipal.getUser(), postDto, studyId);
    }

    @PatchMapping("/{studyId}/post/{postId}/comment/{commentId}")
    public ApiResult<CommentDto> updateComment(@CurrentUser PrincipalDetails userPrincipal,
                                               @PathVariable Long postId, @PathVariable String commentId, @RequestBody CommentDto commentDto){
        commentDto.setId(commentId);
        return commentService.updateComment(userPrincipal.getUser(), commentDto);
    }


}
