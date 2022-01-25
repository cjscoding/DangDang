package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.StudyHashTag;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyHashTagDto {

    private Long id;
    private String hashTag;

    public static StudyHashTagDto of(StudyHashTag hashTag){
        return StudyHashTagDto.builder()
                .id(hashTag.getId())
                .hashTag(hashTag.getHashTag())
                .build();
    }
}
