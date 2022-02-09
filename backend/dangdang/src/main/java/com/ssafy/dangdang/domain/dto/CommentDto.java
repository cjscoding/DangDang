package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.Comment;
import com.ssafy.dangdang.domain.types.CommentType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Schema(description = "댓글 정보")
public class CommentDto {
    @Schema(accessMode = Schema.AccessMode.AUTO, description = "댓글 Id")
    private String id;
    @Schema(description = "댓글 내용", example = "댓글 댓글")
    private String content;
    @Schema(description = "참조하는 객체 Id, {StudyId, PostId, ResumeId}", example = "1")
    private Long referenceId;
    @Schema(description = "참조하는 객체 타입", example = "STUDY")
    private CommentType commentType;
    @Schema(description = "댓글 깊이", example = "0")
    private Integer depth;
    @Schema(description = "작성자 Id", example = "1")
    private Long writerId;
    @Schema(description = "작성자 닉네임", example = "민초맨")
    private String writerNickname;
    @Schema(description = "작성자 이메일", example = "test@ssafy.com")
    private String writerEmail;
    @Schema(description = "작성자 프로필 이미지", example = "default.jpg")
    private String writerImageUrl;
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "댓글 생성 날짜")
    private LocalDateTime createdAt;
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "댓글 수정 날짜")
    private LocalDateTime updatedAt ;

    @Schema(description = "댓글 노출 유무, 유저가 삭제되면, 이 속성이 false로 바뀜", example = "true")
    private Boolean visable;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "답글 목록")
    private List<CommentDto> children;
    @Schema(description = "답글을 작성할 댓글Id")
    private String parentId;


    public static CommentDto of(WriteComment writeComment){
        if(writeComment.getParentId() != null)
        return CommentDto.builder()
                .parentId(writeComment.getParentId())
                .content(writeComment.getContent())
                .build();
        else
            return CommentDto.builder()
                    .content(writeComment.getContent())
                    .build();
    }

    public static CommentDto of(Comment comment){
        if (comment.getChildren() != null){
            List<Comment> children = comment.getChildren();
            List<CommentDto> commentDtos = children.stream().map(child -> CommentDto.of(child))
                    .collect(Collectors.toList());
            return CommentDto.builder()
                    .id(comment.getId())
                    .content(comment.getContent())
                    .depth(comment.getDepth())
                    .createdAt(comment.getCreatedAt())
                    .updatedAt(comment.getUpdatedAt())
                    .referenceId(comment.getReferenceId())
                    .commentType(comment.getCommentType())
                    .writerId(comment.getWriterId())
                    .writerEmail(comment.getWriterEmail())
                    .writerNickname(comment.getWriterNickname())
                    .writerImageUrl(comment.getWriterImageUrl())
                    .visable(comment.getVisable())
                    .children(commentDtos)
                    .build();
        }
        else
            return CommentDto.builder()
                    .id(comment.getId())
                    .content(comment.getContent())
                    .depth(comment.getDepth())
                    .createdAt(comment.getCreatedAt())
                    .updatedAt(comment.getUpdatedAt())
                    .referenceId(comment.getReferenceId())
                    .commentType(comment.getCommentType())
                    .writerId(comment.getWriterId())
                    .writerEmail(comment.getWriterEmail())
                    .writerNickname(comment.getWriterNickname())
                    .writerImageUrl(comment.getWriterImageUrl())
                    .visable(comment.getVisable())
                    .build();
    }


}
