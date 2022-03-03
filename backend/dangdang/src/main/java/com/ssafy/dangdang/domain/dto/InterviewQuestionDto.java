package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.domain.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import javax.persistence.*;

@Schema(description = "면접 질문 정보")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InterviewQuestionDto {

    @Schema(description = "면접 질문 Id", example = "1")
    private Long id;
    @Schema(description = "면접 질문 분야, {공통, 인성, 기술, 기타}", example = "인성")
    private String field;
    @Schema(description = "직군, {IT, 디자인, 마케팅, 기타}", example = "IT")
    private String job;
    @Schema(description = "면접 질문", example = "민초에 대해서 어떻게 생각하시나요?")
    private String question;
    @Schema(description = "면접 질문 대답", example = "완벽한 음식이죠")
    private String answer;
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "작성자")
    private UserDto writer;
    @Schema(description = "공개 유무", example = "true")
    private boolean visable;

    public static InterviewQuestionDto of(WriteInterview writeInterview){
        return InterviewQuestionDto.builder()
                .field(writeInterview.getField())
                .job(writeInterview.getJob())
                .question(writeInterview.getQuestion())
                .answer(writeInterview.getAnswer())
                .visable(true)
                .build();
    }

    public static InterviewQuestionDto of(InterviewQuestion interviewQuestion){
        return InterviewQuestionDto.builder()
                .id(interviewQuestion.getId())
                .question(interviewQuestion.getQuestion())
                .answer(interviewQuestion.getAnswer())
                .field(interviewQuestion.getField().toString())
                .job(interviewQuestion.getJob().toString())
                .visable(interviewQuestion.getVisable())
                .writer(UserDto.of(interviewQuestion.getWriter()))
                .build();
    }
}
