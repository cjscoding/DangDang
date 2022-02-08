package com.ssafy.dangdang.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Schema(description = "스터디 생성")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MakeStudy {

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

    @Schema(description = "스터디의 목표기업, 추후 Enum타입으로 교체될 수 있음음", nullable = true, example = "네이버 가즈아~~!")
    private String goal;

    @Builder.Default
    @Schema(description = "스터디와 연관된 해쉬태그들", nullable = true, example = "[\"네이버\", \"카카오\", \"토론면접\"]")
    private List<String> hashTags = new ArrayList<>();
}
