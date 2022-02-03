package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Comment;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.CommentDto;
import com.ssafy.dangdang.domain.types.CommentType;
import com.ssafy.dangdang.domain.types.UserRoleType;
import com.ssafy.dangdang.exception.UnauthorizedAccessException;
import com.ssafy.dangdang.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        Comment comment;
        if (commentDto.getParentId() != null){
            Comment parent = commentRepository.findCommentById(commentDto.getParentId()).get();
            commentDto.setDepth(parent.getDepth()+1);
            comment = Comment.of(user, commentDto);
            commentRepository.save(comment);
            parent.getChildren().add(comment);
            commentRepository.save(parent);
        } else{
            commentDto.setDepth(0);
            comment = Comment.of(user, commentDto);
            commentRepository.save(comment);
        }
        return CommentDto.of(comment);
    }

    @Override
    public ApiResult<CommentDto> updateComment(User user, CommentDto commentDto) {
        Optional<Comment> comment = commentRepository.findCommentById(commentDto.getId());
        if (!comment.isPresent()) throw new NullPointerException("존재하지 않는 댓글 입니다.");
        if (comment.get().getWriterId() != user.getId() && user.getRole() != UserRoleType.ADMIN)  throw new UnauthorizedAccessException("작성자만이 삭제할 수 있습니다.");
        Comment updateComment ;

        if (commentDto.getChildren() != null){

            List<Comment> children = comment.get().getChildren();

            updateComment =  Comment.builder()
                    .id(commentDto.getId())
                    .content(commentDto.getContent())
                    .depth(comment.get().getDepth())
                    .createdAt(comment.get().getCreatedAt())
                    .updatedAt(LocalDateTime.now())
                    .writerNickname(user.getNickname())
                    .writerEmail(user.getEmail())
                    .writerId(user.getId())
                    .referenceId(comment.get().getReferenceId())
                    .commentType(comment.get().getCommentType())
                    .children(children)
                    .build();
        }

        else
            updateComment = Comment.builder()
                    .id(commentDto.getId())
                    .content(commentDto.getContent())
                    .depth(comment.get().getDepth())
                    .createdAt(comment.get().getCreatedAt())
                    .updatedAt(LocalDateTime.now())
                    .writerNickname(user.getNickname())
                    .writerEmail(user.getEmail())
                    .writerId(user.getId())
                    .referenceId(comment.get().getReferenceId())
                    .commentType(comment.get().getCommentType())
                    .build();

        commentRepository.save(updateComment);
        return success(CommentDto.of(updateComment));
    }

    @Override
    @Transactional
    public Page<CommentDto> findCommentByReferenceIdWithPage(Long postId, CommentType commentType, Pageable pageable) {
        Page<Comment> comments = commentRepository.findByReferenceIdAndDepthAndCommentType(postId, 0, commentType, pageable);
        Page<CommentDto> commentDtos = comments.map( comment -> CommentDto.of(comment));
        return commentDtos;
    }

    @Override
    public ApiResult<String> deleteComment(User user, String CommentId) {
        Optional<Comment> comment = commentRepository.findCommentById(CommentId);
        if (!comment.isPresent())  throw new NullPointerException("존재하지 않는 댓글 입니다.");
        if(comment.get().getWriterId() != user.getId()) throw new UnauthorizedAccessException("작성자만 삭제할 수 있습니ㅏㄷ.");
        if(!comment.get().getChildren().isEmpty()){
            for (Comment child:
                 comment.get().getChildren()) {
                this.deleteComment(child);
            }
        }
        commentRepository.delete(comment.get());
        return success("댓글 삭제 성공!");
    }

    @Override
    public ApiResult<String> deleteComment(Comment comment) {

        if(!comment.getChildren().isEmpty()){
            for (Comment child:
                    comment.getChildren()) {
                    this.deleteComment(child);
            }
        }
        commentRepository.delete(comment);
        return success("댓글 삭제 성공!");
    }

    @Override
    public Optional<Comment> findById(String commentId){
        return commentRepository.findCommentById(commentId);
    }
}
