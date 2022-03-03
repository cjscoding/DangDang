package com.ssafy.dangdang.domain;

import com.ssafy.dangdang.domain.dto.InterviewQuestionDto;
import com.ssafy.dangdang.domain.types.InterviewField;
import com.ssafy.dangdang.domain.types.InterviewJob;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 25)
    @Enumerated(EnumType.STRING)
    private InterviewField field;

    @Column(length = 25)
    @Enumerated(EnumType.STRING)
    private InterviewJob job;

    @Column(length = 300)
    private String question;

    @Lob
    private String answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer")
    private User writer;

    private Boolean visable;


    public static InterviewQuestion of(InterviewQuestionDto interviewQuestionDto, User user){
        return InterviewQuestion.builder()
                .id(interviewQuestionDto.getId())
                .question(interviewQuestionDto.getQuestion())
                .answer(interviewQuestionDto.getAnswer())
                .field(InterviewField.valueOf(interviewQuestionDto.getField()))
                .job(InterviewJob.valueOf(interviewQuestionDto.getJob()))
                .visable(interviewQuestionDto.isVisable())
                .writer(user)
                .build();
    }

    public void makePubic(){
        this.visable = true;
    }
    public void hide(){
        this.visable = false;
    }

    @Override
    public String toString() {
        return "InterviewQuestion{" +
                "id=" + id +
                ", field='" + field + '\'' +
                ", question='" + question + '\'' +
                ", answer='" + answer + '\'' +
                ", writer=" + writer +
                ", visable=" + visable +
                '}';
    }

}
