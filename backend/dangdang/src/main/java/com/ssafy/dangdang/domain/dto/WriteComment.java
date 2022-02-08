package com.ssafy.dangdang.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Schema(description = "댓글 작성")
public class WriteComment {

    @Schema(description = "답글을 작성할 댓글Id, 답글로 작성할 때에만 작성")
    private String parentId;
    @Schema(description = "댓글 내용", example = "댓글 댓글")
    private String content;
}
