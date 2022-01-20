package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.domain.User;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InterviewQuestionDto {


    private Long id;

    private String field;

    private String question;

    private String answer;

    private UserDto writer;

    private boolean visable;

    public static InterviewQuestionDto of(InterviewQuestion interviewQuestion){
        return InterviewQuestionDto.builder()
                .id(interviewQuestion.getId())
                .question(interviewQuestion.getQuestion())
                .answer(interviewQuestion.getAnswer())
                .field(interviewQuestion.getField())
                .writer(UserDto.of(interviewQuestion.getWriter()))
                .build();
    }
}
