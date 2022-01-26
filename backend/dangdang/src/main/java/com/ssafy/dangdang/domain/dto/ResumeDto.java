package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.ResumeQuestion;
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
public class ResumeDto {

    @NotNull
    private Long id;

    @Builder.Default
    private List<ResumeQuestionDto> resumeQuestionList = new ArrayList<>();

    private Page<CommentDto> commentDtos;

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
