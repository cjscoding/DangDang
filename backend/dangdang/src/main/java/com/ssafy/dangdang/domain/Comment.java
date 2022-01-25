package com.ssafy.dangdang.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.dangdang.domain.dto.CommentDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

//@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Document
public class Comment {

    @Id
    private String id;

//    @Lob
    private String content;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JsonIgnore
//    @JoinColumn(name = "post_id")
    private Long postId;
    private Integer depth;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();


    //    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "writer")
    private Long writerId;
    private String writerNickname;
    private String writerEmail;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "Children_id")
    @DBRef
    @Builder.Default
    private List<Comment> children = new ArrayList<>();

//    @OneToMany(mappedBy = "Children", orphanRemoval = true)
//    @Builder.Default


    @Override
    public String toString() {
        return "Comment{" +
                "id='" + id + '\'' +
                ", content='" + content + '\'' +
                ", postId=" + postId +
                ", depth=" + depth +
                ", writerId=" + writerId +
                ", writerNickname='" + writerNickname + '\'' +
                ", writerEmail='" + writerEmail + '\'' +
                ", Children=" + children +
                '}';
    }

    public static Comment of(CommentDto commentDto){
        if (commentDto.getChildren() != null){
            List<CommentDto> childrenDtos = commentDto.getChildren();
            List<Comment> children =  childrenDtos.stream().map(childDto -> Comment.of(childDto)).collect(Collectors.toList());
            return Comment.builder()
                    .id(commentDto.getId())
                    .content(commentDto.getContent())
                    .createdAt(commentDto.getCreatedAt())
                    .updatedAt(commentDto.getUpdatedAt())
                    .depth(commentDto.getDepth())
                    .writerNickname(commentDto.getWriterNickname())
                    .writerEmail(commentDto.getWriterEmail())
                    .writerId(commentDto.getWriterId())
                    .postId(commentDto.getPostId())
                    .children(children)
                    .build();
        }

        else return Comment.builder()
                .id(commentDto.getId())
                .content(commentDto.getContent())
                .createdAt(commentDto.getCreatedAt())
                .updatedAt(commentDto.getUpdatedAt())
                .depth(commentDto.getDepth())
                .writerNickname(commentDto.getWriterNickname())
                .writerEmail(commentDto.getWriterEmail())
                .writerId(commentDto.getWriterId())
                .postId(commentDto.getPostId())
                .build();
    }

    public static Comment of(User user, CommentDto commentDto){
        if (commentDto.getChildren() != null){
            List<CommentDto> childrenDtos = commentDto.getChildren();
            List<Comment> children =  childrenDtos.stream().map(childDto -> Comment.of(childDto)).collect(Collectors.toList());
            return Comment.builder()
                    .id(commentDto.getId())
                    .content(commentDto.getContent())
                    .depth(commentDto.getDepth())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .writerNickname(user.getNickname())
                    .writerEmail(user.getEmail())
                    .writerId(user.getId())
                    .postId(commentDto.getPostId())
                    .children(children)
                    .build();
        }

        else
            return Comment.builder()
                    .id(commentDto.getId())
                    .content(commentDto.getContent())
                    .depth(commentDto.getDepth())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .writerNickname(user.getNickname())
                    .writerEmail(user.getEmail())
                    .writerId(user.getId())
                    .postId(commentDto.getPostId())
                    .build();
    }
//    private List<Comment> children = new ArrayList<>();

}
