package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Comment;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.CommentDto;
import com.ssafy.dangdang.domain.types.UserRoleType;
import com.ssafy.dangdang.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.ssafy.dangdang.util.ApiUtils.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    @Override
    public CommentDto writeComment(User user, CommentDto commentDto) {
        Comment comment = Comment.of(user, commentDto);
        commentRepository.save(comment);
        if (commentDto.getParentId() != null){
            Comment parent = commentRepository.findCommentById(commentDto.getParentId()).get();
            parent.getChildren().add(comment);
            commentRepository.save(parent);
        }

        return CommentDto.of(comment);
    }

    @Override
    public ApiResult<CommentDto> updateComment(User user, CommentDto commentDto) {
        Optional<Comment> comment = commentRepository.findCommentById(commentDto.getId());
        if (!comment.isPresent()) return (ApiResult<CommentDto>) error("존재하지 않는 댓글 입니다.", HttpStatus.NOT_FOUND);
        if (comment.get().getWriterId() != user.getId() && user.getRole() == UserRoleType.ADMIN)  return (ApiResult<CommentDto>) error("작성자만 댓글을 삭제할 수 있습니다.", HttpStatus.NOT_FOUND);
        Comment updateComment ;

        //TODO: 참조 객체가 바뀌면, 따로 연관관계 셋팅을 안해도 알아서 바뀌는지 테스트 필요함
//        if (commentDto.getParentId() != null){
//            Comment parent = commentRepository.findCommentById(commentDto.getParentId()).get();
//            parent.getChildren().add(comment);
//            commentRepository.save(parent);
//        }

        if (commentDto.getChildren() != null){
            List<CommentDto> childrenDtos = commentDto.getChildren();
            List<Comment> children =  childrenDtos.stream().map(childDto -> Comment.of(childDto)).collect(Collectors.toList());
            updateComment =  Comment.builder()
                    .id(commentDto.getId())
                    .content(commentDto.getContent())
                    .depth(commentDto.getDepth())
                    .createdAt(comment.get().getCreatedAt())
                    .updatedAt(LocalDateTime.now())
                    .writerNickname(user.getNickname())
                    .writerEmail(user.getEmail())
                    .writerId(user.getId())
                    .postId(commentDto.getPostId())
                    .children(children)
                    .build();
        }

        else
            updateComment = Comment.builder()
                    .id(commentDto.getId())
                    .content(commentDto.getContent())
                    .depth(commentDto.getDepth())
                    .createdAt(comment.get().getCreatedAt())
                    .updatedAt(LocalDateTime.now())
                    .writerNickname(user.getNickname())
                    .writerEmail(user.getEmail())
                    .writerId(user.getId())
                    .postId(commentDto.getPostId())
                    .build();

        commentRepository.save(updateComment);
        return success(CommentDto.of(updateComment));
    }

    @Override
    public Page<CommentDto> findCommentByPostIdWithPage(Long postId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findByPostIdAndDepth(postId, 0, pageable);
        Page<CommentDto> commentDtos = comments.map( comment -> CommentDto.of(comment));
        return commentDtos;
    }

    @Override
    public ApiResult<String> deleteComment(User user, String CommentId) {
        Optional<Comment> comment = commentRepository.findCommentById(CommentId);
        if (!comment.isPresent()) return (ApiResult<String>) error("없는 댓글 입니다.", HttpStatus.NOT_FOUND);
        if(comment.get().getWriterId() != user.getId()) return (ApiResult<String>) error("작성자만 삭제할 수 있습니다.", HttpStatus.FORBIDDEN);
        commentRepository.delete(comment.get());
        return success("댓글 삭제 성공!");
    }

    @Override
    public Optional<Comment> findById(String commentId){
        return commentRepository.findCommentById(commentId);
    }
}
