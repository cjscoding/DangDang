package com.ssafy.dangdang.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Schema(description = "면접 질문 작성")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WriteInterview {

    @Schema(description = "면접 질문 Id", example = "1")
    private Long id;
    @Schema(description = "면접 질문 분야, {기술, 인성}", example = "인성")
    private String field;
    @Schema(description = "면접 질문", example = "민초에 대해서 어떻게 생각하시나요?")
    private String question;
    @Schema(description = "면접 질문 대답", example = "완벽한 음식이죠")
    private String answer;
    @Schema(description = "공개 유무", example = "true")
    private boolean visable;

}
