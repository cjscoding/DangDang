package com.ssafy.dangdang.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "자소서 작성")
public class WriteResume {

    @Builder.Default
    @Schema(description = "자소서 질문 리스트")
    private List<ResumeQuestionDto> resumeQuestionList = new ArrayList<>();

}
