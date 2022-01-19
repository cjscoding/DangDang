package com.ssafy.dangdang.domain;

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
    private String field;

    @Column(length = 300)
    private String question;

    @Lob
    private String answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer")
    private User writer;

    private boolean visable;

}
