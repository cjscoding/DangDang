package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.Post;
import lombok.*;

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

    public static PostDto of(Post post){
        return PostDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .userDto(UserDto.of(post.getWriter()))
                .studyDto(StudyDto.of(post.getStudy()))
                .build();

    }

}
