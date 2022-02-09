package com.ssafy.dangdang.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.dangdang.domain.dto.ResumeQuestionDto;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.domain.dto.UserDto;
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
public class ResumeQuestion {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    @JsonIgnore
    private Resume resume;

    @Column(length = 300)
    private String question;

    @Lob
    private String answer;



    public static ResumeQuestion of(Resume resume, ResumeQuestionDto resumeQuestionDto) {

        return ResumeQuestion.builder()
                .id(resumeQuestionDto.getId())
                .resume(resume)
                .question(resumeQuestionDto.getQuestion())
                .answer(resumeQuestionDto.getAnswer())
                .build();

    }

    @Override
    public String toString() {
        return "ResumeQuestion{" +
                "id=" + id +
                ", question='" + question + '\'' +
                ", answer='" + answer + '\'' +
                '}';
    }


}
