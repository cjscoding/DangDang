package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.Study;
import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyDto {

    private Long id;

    @NotBlank
    private String name;

    @NotNull
    private Integer number;

    private String introduction;

    private LocalDateTime createdAt;

    private String target;

    private UserDto userDto;

    public static StudyDto of(Study study) {

        UserDto userDto = UserDto.of(study.getHost());

        return StudyDto.builder()
                .id(study.getId())
                .name(study.getName())
                .introduction(study.getIntroduction())
                .target(study.getTarget())
                .createdAt(study.getCreatedAt())
                .number(study.getNumber())
                .userDto(userDto)
                .build();

    }

}
