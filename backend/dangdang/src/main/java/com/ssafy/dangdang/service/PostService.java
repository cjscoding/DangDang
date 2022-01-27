package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Post;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.PostDto;
import com.ssafy.dangdang.util.ApiUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface PostService {
    ApiUtils.ApiResult<PostDto> writePost(User user, PostDto postDto, Long studyId);

    ApiUtils.ApiResult<Post> updatePost(User user, PostDto postDto, Long studyId);

    ApiUtils.ApiResult<String> deletePost(User user, Long postId);

    Page<PostDto> getAllPost(Long studyId, Pageable pageable);

    Optional<Post> findById(Long postId);

    PostDto findPostDtoById(Long postId);
}
