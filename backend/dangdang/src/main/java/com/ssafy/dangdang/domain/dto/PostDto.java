package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.Post;
import lombok.*;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostDto {

    private Long id;

    private String title;
    private String content;

    private UserDto userDto;
    private StudyDto studyDto;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt ;

    private Page<CommentDto> comments;

    public static PostDto of(Post post){
        return PostDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .userDto(UserDto.of(post.getWriter()))
                .studyDto(StudyDto.of(post.getStudy()))
                .build();

    }

}
