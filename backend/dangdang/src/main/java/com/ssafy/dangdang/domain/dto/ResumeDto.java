package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.ResumeQuestion;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.security.core.parameters.P;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "자소서 정보")
public class ResumeDto {

    @NotNull
    @Schema(description = "자소서 Id", example = "1")
    private Long id;

    @Builder.Default
    @Schema(description = "자소서 질문 리스트")
    private List<ResumeQuestionDto> resumeQuestionList = new ArrayList<>();

    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "댓글 목록")
    private Page<CommentDto> commentDtos;


    public static ResumeDto of(WriteResume writeResume){
        if ((writeResume.getId() != null))
        return ResumeDto.builder()
                .id(writeResume.getId())
                .resumeQuestionList(writeResume.getResumeQuestionList())
                .build();

        return ResumeDto.builder()
                .resumeQuestionList(writeResume.getResumeQuestionList())
                .build();
    }


    public static ResumeDto of(Resume resume){

        List<ResumeQuestionDto> resumeQuestionDtoList = resume.getResumeQuestionList()
                .stream().map(ResumeQuestionDto::of).collect(Collectors.toList());

        return ResumeDto.builder()
                .id(resume.getId())
                .resumeQuestionList(resumeQuestionDtoList)
                .build();

    }


    @Override
    public String toString() {
        return "ResumeDto{" +
                "id=" + id +
                ", resumeQuestionList=" + resumeQuestionList +
                '}';
    }
}
