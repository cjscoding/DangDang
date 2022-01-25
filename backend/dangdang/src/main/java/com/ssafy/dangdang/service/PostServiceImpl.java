package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Post;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.PostDto;
import com.ssafy.dangdang.repository.PostRepository;
import com.ssafy.dangdang.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.ssafy.dangdang.util.ApiUtils.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostServiceImpl implements PostService{


    private final PostRepository postRepository;
    private final StudyRepository studyRepository;
    private final UserService userService;

    @Override
    public ApiResult<PostDto> writePost(User user, PostDto postDto, Long studyId) {
        Optional<Study> study = studyRepository.findById(studyId);
        if (!study.isPresent()) error("없는 스터디 입니다.", HttpStatus.NOT_FOUND);

        Post post = Post.of(postDto, user, study.get());
        postRepository.save(post);
        return success(PostDto.of(post));
    }

    @Override
    public ApiResult<Post> updatePost(User user, PostDto postDto, Long studyId) {
        Optional<Study> study = studyRepository.findById(studyId);
        if (!study.isPresent()) error("없는 스터디 입니다.", HttpStatus.NOT_FOUND);

        Post post =Post.builder()
                .id(postDto.getId())
                .title(postDto.getTitle())
                .content(postDto.getContent())
                .writer(user)
                .updatedAt(LocalDateTime.now())
                .study(study.get())
                .build();
        postRepository.save(post);
        return success(post);
    }

    @Override
    public ApiResult<String> deletePost(User user, Long postId) {
        Optional<Post> post = postRepository.findById(postId);

        if (!post.isPresent()) return (ApiResult<String>) error("없는 게시글입니다.", HttpStatus.NOT_FOUND);
        if (post.get().getWriter().getId() == user.getId()) error("작성자만 삭제할 수 있습니다.", HttpStatus.FORBIDDEN);
        postRepository.delete(post.get());
        return success("삭제 성공");
    }



    @Override
    public Page<PostDto> getAllPost(Long studyId, Pageable pageable){
        Page<Post> postByAllWithUser = postRepository.findPostByAllWithUser(studyId, pageable);
        Page<PostDto> postDtos = postByAllWithUser.map(PostDto::of);
        return postDtos;
    }

    @Override
    public Optional<Post> findById(Long postId){
        return postRepository.findById(postId);
    }

    @Override
    public PostDto findPostDtoById(Long postId){
        return PostDto.of(postRepository.findPostWithUser(postId));
    }
}
