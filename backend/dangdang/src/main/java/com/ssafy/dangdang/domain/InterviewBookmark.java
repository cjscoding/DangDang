package com.ssafy.dangdang.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {@UniqueConstraint(name = "USER_STUDY_QUIQUE", columnNames = {"user_id", "interview_id"})})
public class InterviewBookmark implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private  User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "interview_id")
    private InterviewQuestion interviewQuestion;

    public static InterviewBookmark of(User user, InterviewQuestion interviewQuestion){
        return InterviewBookmark.builder()
                .user(user)
                .interviewQuestion(interviewQuestion)
                .build();
    }
}
