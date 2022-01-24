package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Comment;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.CommentDto;
import com.ssafy.dangdang.util.ApiUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface CommentService {

    public CommentDto writeComment(User user, CommentDto commentDto);
    public ApiUtils.ApiResult<CommentDto> updateComment(User user, CommentDto commentDto);

    public Page<CommentDto> findCommentByPostIdWithPage(Long postId, Pageable pageable);

    ApiUtils.ApiResult<String> deleteComment(User user, String CommentId);

    ApiUtils.ApiResult<String> deleteComment(Comment comment);

    Optional<Comment> findById(String commentId);
}
