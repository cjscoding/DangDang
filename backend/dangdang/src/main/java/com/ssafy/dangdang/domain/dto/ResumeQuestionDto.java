package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.ResumeQuestion;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResumeQuestionDto {

    @Schema(description = "자소서 질문 Id", example = "1")
    private Long id;

    @NotBlank
    @Schema(description = "자소서 질문", example = "Do you like Mint Choco?")
    private String question;

    @NotBlank
    @Schema(description = "자소서 질문답", example = "I like that, Mint Choco is my Life")
    private String answer;


    public static ResumeQuestionDto of(ResumeQuestion resumeQuestion){
        return ResumeQuestionDto.builder()
                .id(resumeQuestion.getId())
                .question(resumeQuestion.getQuestion())
                .answer(resumeQuestion.getAnswer())
                .build();

    }


    @Override
    public String toString() {
        return "ResumeQuestionDto{" +
                "id=" + id +
                ", question='" + question + '\'' +
                ", answer='" + answer + '\'' +
                '}';
    }
}
