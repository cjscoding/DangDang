package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.Joins;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.StudyHashTag;
import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    private String description;

    private String openKakao;

    private LocalDateTime createdAt;

    private String goal;

    private UserDto userDto;

    @Builder.Default
    private List<StudyHashTagDto> hashTags = new ArrayList<>();
    @Builder.Default
    private List<UserDto> userDtos = new ArrayList<>();

    //User Fetch Join용
    private Long hostId;
    private String hostNickname;
    private String hostEmail;

    public StudyDto(Long id, String name, Integer number, String description,
                    LocalDateTime createdAt, String goal, Long hostId, String hostNickname, String hostEmail, List<StudyHashTagDto> hashTags) {
        this.id = id;
        this.name = name;
        this.number = number;
        this.description = description;
        this.createdAt = createdAt;
        this.goal = goal;

        this.hashTags =hashTags;

        this.hostId = hostId;
        this.hostNickname = hostNickname;
        this.hostEmail =hostEmail;
    }

    public StudyDto(Long id, String name, Integer number, String description,
                    LocalDateTime createdAt, String goal,List<StudyHashTagDto> hashTags) {
        this.id = id;
        this.name = name;
        this.number = number;
        this.description = description;
        this.createdAt = createdAt;
        this.goal = goal;
        this.hashTags =hashTags;
    }

    public static StudyDto of(Study study) {

        List<Joins> joins = study.getJoins();
        List<UserDto> userDtoLIst = joins.stream().map(join -> UserDto.of(join.getUser())).collect(Collectors.toList());


        UserDto userDto = UserDto.of(study.getHost());
        List<StudyHashTagDto> hashTags = study.getHashTags()
                .stream().map(StudyHashTagDto::of)
                .collect(Collectors.toList());
        return StudyDto.builder()
                .id(study.getId())
                .name(study.getName())
                .description(study.getDescription())
                .goal(study.getGoal())
                .createdAt(study.getCreatedAt())
                .openKakao(study.getOpenKakao())
                .hashTags(hashTags)
                .number(study.getNumber())
                .userDtos(userDtoLIst)
                .userDto(userDto)
                .build();

    }

    public StudyDto(Study study) {

        UserDto userDto = UserDto.of(study.getHost());
        List<StudyHashTagDto> hashTags = study.getHashTags()
                .stream().map(StudyHashTagDto::of)
                .collect(Collectors.toList());
        id = study.getId();
        name = study.getName();
        description = study.getDescription();
        goal = study.getGoal();
        createdAt = study.getCreatedAt();
        openKakao = study.getOpenKakao();
        hashTags = hashTags;
        number =study.getNumber();
        userDto = userDto;
//        return StudyDto.builder()
//                .id(study.getId())
//                .name(study.getName())
//                .description(study.getDescription())
//                .goal(study.getGoal())
//                .createdAt(study.getCreatedAt())
//                .openKakao(study.getOpenKakao())
//                .hashTags(hashTags)
//                .number(study.getNumber())
//                .userDto(userDto)
//                .build();

    }

}
