package com.ssafy.dangdang.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "스터디 가입 신청 ")
public class ManageStudy {

    @Schema(description = "가입 신청한 스터디 Id", example = "1")
    private Long studyId;
    @Schema(description = "가입 신청한 유저 Id", example = "1")
    private Long userId;
}
