package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.Joins;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.StudyHashTag;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.data.domain.Page;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Schema(description = "스터디 정보")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyDto {

    @Schema(accessMode = Schema.AccessMode.AUTO, description = "스터디 Id", example = "1")
    private Long id;

    @NotBlank
    @Schema(description = "스터디 이름", nullable = false, example = "네이버 취뽀 스터디")
    private String name;

    @NotNull
    @Schema(description = "스터디 최대 인원", nullable = false, example = "4")
    private Integer number;

    @Schema(description = "스터디 설명", nullable = true, example = "2022년 상반기 네이버 공채 면접 준비 스터디입니다.")
    private String description;

    @Schema(description = "스터디원들과 소통을 위한 오픈카톡 주소", nullable = true, example = "https://open.kakao.com/o/glDxqScc")
    private String openKakao;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "스터디 생성 날짜", nullable = true)
    private LocalDateTime createdAt;
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "마지막 스터디 진행 날짜", nullable = true)
    private LocalDateTime lastAccessTime;

    @Schema(description = "스터디의 목표기업, 추후 Enum타입으로 교체될 수 있음음", nullable = true, example = "네이버 가즈아~~!")
    private String goal;

    @Schema( accessMode = Schema.AccessMode.READ_ONLY,readOnly = true, required = false, description = "스터디장, 스터디를 만든 유저", nullable = true)
    private UserDto host;

    @Builder.Default
    @Schema(description = "스터디와 연관된 해쉬태그들", nullable = true, example = "[\"네이버\", \"카카오\", \"토론면접\"]")
    private List<String> hashTags = new ArrayList<>();

    @Builder.Default
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "스터디에 가입한 회원들", nullable = true)
    private List<UserDto> userDtos = new ArrayList<>();

    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "스터디 상세 페이지에 달린 댓글들", nullable = true)
    private Page<CommentDto> commentDtos;


    public static StudyDto of(MakeStudy makeStudy) {
        return StudyDto.builder()
                .name(makeStudy.getName())
                .number(makeStudy.getNumber())
                .description(makeStudy.getDescription())
                .goal(makeStudy.getGoal())
                .hashTags(makeStudy.getHashTags())
                .openKakao(makeStudy.getOpenKakao())
                .build();
    };



    public static StudyDto of(Study study) {
        List<Joins> joins = study.getJoins();
        List<UserDto> userDtoLIst = joins.stream().map(join -> UserDto.of(join.getUser())).collect(Collectors.toList());


        UserDto userDto = UserDto.of(study.getHost());
        List<String> hashTags = study.getHashTags()
                .stream().map(StudyHashTag::getHashTag)
                .collect(Collectors.toList());
        return StudyDto.builder()
                .id(study.getId())
                .name(study.getName())
                .description(study.getDescription())
                .goal(study.getGoal())
                .createdAt(study.getCreatedAt())
                .lastAccessTime(study.getLastAccessTime())
                .openKakao(study.getOpenKakao())
                .hashTags(hashTags)
                .number(study.getNumber())
                .userDtos(userDtoLIst)
                .host(userDto)
                .build();

    }



}
