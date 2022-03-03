package com.ssafy.dangdang.domain;

import com.ssafy.dangdang.domain.dto.CommentDto;
import com.ssafy.dangdang.domain.types.CommentType;
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
    private Long referenceId;

    @Enumerated(EnumType.STRING)
    private CommentType commentType;

    private Integer depth;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();


    //    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "writer")
    private Long writerId;
    private String writerNickname;

    public void setWriterNickname(String writerNickname) {
        this.writerNickname = writerNickname;
    }

    public void setWriterEmail(String writerEmail) {
        this.writerEmail = writerEmail;
    }

    public void setWriterImageUrl(String writerImageUrl) {
        this.writerImageUrl = writerImageUrl;
    }

    private String writerEmail;
    private String writerImageUrl;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "Children_id")
    @DBRef
    @Builder.Default
    private List<Comment> children = new ArrayList<>();

    private Boolean visable;

//    @OneToMany(mappedBy = "Children", orphanRemoval = true)
//    @Builder.Default


    @Override
    public String toString() {
        return "Comment{" +
                "id='" + id + '\'' +
                ", content='" + content + '\'' +
                ", postId=" + referenceId +
                ", depth=" + depth +
                ", writerId=" + writerId +
                ", writerNickname='" + writerNickname + '\'' +
                ", writerEmail='" + writerEmail + '\'' +
                ", Children=" + children +
                '}';
    }

//    public static Comment of(CommentDto commentDto){
//        if (commentDto.getChildren() != null){
//            List<CommentDto> childrenDtos = commentDto.getChildren();
//            List<Comment> children =  childrenDtos.stream().map(childDto -> Comment.of(childDto)).collect(Collectors.toList());
//            return Comment.builder()
//                    .id(commentDto.getId())
//                    .content(commentDto.getContent())
//                    .createdAt(commentDto.getCreatedAt())
//                    .updatedAt(commentDto.getUpdatedAt())
//                    .depth(commentDto.getDepth())
//                    .writerNickname(commentDto.getWriterNickname())
//                    .writerEmail(commentDto.getWriterEmail())
//                    .writerId(commentDto.getWriterId())
//                    .postId(commentDto.getPostId())
//                    .children(children)
//                    .build();
//        }
//
//        else return Comment.builder()
//                .id(commentDto.getId())
//                .content(commentDto.getContent())
//                .createdAt(commentDto.getCreatedAt())
//                .updatedAt(commentDto.getUpdatedAt())
//                .depth(commentDto.getDepth())
//                .writerNickname(commentDto.getWriterNickname())
//                .writerEmail(commentDto.getWriterEmail())
//                .writerId(commentDto.getWriterId())
//                .postId(commentDto.getPostId())
//                .build();
//    }

    public static Comment of(User user, CommentDto commentDto){
        if (commentDto.getChildren() != null){
            List<CommentDto> childrenDtos = commentDto.getChildren();
            List<Comment> children =  childrenDtos.stream().map(childDto -> Comment.of(user,childDto)).collect(Collectors.toList());
            return Comment.builder()
                    .id(commentDto.getId())
                    .content(commentDto.getContent())
                    .depth(commentDto.getDepth())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .writerNickname(user.getNickname())
                    .writerEmail(user.getEmail())
                    .writerId(user.getId())
                    .writerImageUrl(user.getImageUrl())
                    .referenceId(commentDto.getReferenceId())
                    .commentType(commentDto.getCommentType())
                    .visable(true)
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
                    .writerImageUrl(user.getImageUrl())
                    .visable(true)
                    .referenceId(commentDto.getReferenceId())
                    .commentType(commentDto.getCommentType())
                    .build();
    }


    public void disappear(){
        this.visable = false;
    }
//    private List<Comment> children = new ArrayList<>();

}
