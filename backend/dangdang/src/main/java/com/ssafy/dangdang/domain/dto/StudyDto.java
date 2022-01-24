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

    //User Fetch Join용
    private Long hostId;
    private String hostNickname;
    private String hostEmail;

    public StudyDto(Long id, String name, Integer number, String introduction,
                    LocalDateTime createdAt, String target, Long hostId, String hostNickname, String hostEmail) {
        this.id = id;
        this.name = name;
        this.number = number;
        this.introduction = introduction;
        this.createdAt = createdAt;
        this.target = target;
        this.hostId = hostId;
        this.hostNickname = hostNickname;
        this.hostEmail =hostEmail;
    }

    public StudyDto(Long id, String name, Integer number, String introduction,
                    LocalDateTime createdAt, String target) {
        this.id = id;
        this.name = name;
        this.number = number;
        this.introduction = introduction;
        this.createdAt = createdAt;
        this.target = target;
    }

    public static StudyDto of(Study study) {

        UserDto userDto = UserDto.of(study.getHost());

        return StudyDto.builder()
                .id(study.getId())
                .name(study.getName())
                .introduction(study.getDescription())
                .target(study.getTarget())
                .createdAt(study.getCreatedAt())
                .number(study.getNumber())
                .userDto(userDto)
                .build();

    }

}
