package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.ResumeQuestion;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResumeQuestionDto {

    private Long id;

    @NotBlank
    private String question;

    @NotBlank
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
