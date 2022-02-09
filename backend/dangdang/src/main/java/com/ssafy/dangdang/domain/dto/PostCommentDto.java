package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.Comment;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostCommentDto {

    private String id;
    private String content;
    private Long postId;
    private Integer depth;
    private Long writerId;
    private String writerNickname;
    private String writerEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt ;

    private List<PostCommentDto> children;
    private String parentId;

    public static PostCommentDto of(Comment comment){
        if (comment.getChildren() != null){
            List<Comment> children = comment.getChildren();
            List<PostCommentDto> commentDtos = children.stream().map(child -> PostCommentDto.of(child))
                    .collect(Collectors.toList());
            return PostCommentDto.builder()
                    .id(comment.getId())
                    .content(comment.getContent())
                    .depth(comment.getDepth())
                    .createdAt(comment.getCreatedAt())
                    .updatedAt(comment.getUpdatedAt())
                    .postId(comment.getReferenceId())
                    .writerId(comment.getWriterId())
                    .writerEmail(comment.getWriterEmail())
                    .writerNickname(comment.getWriterNickname())
                    .children(commentDtos)
                    .build();
        }
        else
            return PostCommentDto.builder()
                    .id(comment.getId())
                    .content(comment.getContent())
                    .depth(comment.getDepth())
                    .createdAt(comment.getCreatedAt())
                    .updatedAt(comment.getUpdatedAt())
                    .postId(comment.getReferenceId())
                    .writerId(comment.getWriterId())
                    .writerEmail(comment.getWriterEmail())
                    .writerNickname(comment.getWriterNickname())
                    .build();
    }

    @Override
    public String toString() {
        return "PostCommentDto{" +
                "id='" + id + '\'' +
                ", content='" + content + '\'' +
                ", postId=" + postId +
                ", depth=" + depth +
                ", writerId=" + writerId +
                ", writerNickname='" + writerNickname + '\'' +
                ", writerEmail='" + writerEmail + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", children=" + children +
                ", parentId='" + parentId + '\'' +
                '}';
    }
}
