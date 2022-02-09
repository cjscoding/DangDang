package com.ssafy.dangdang.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.dangdang.domain.dto.ResumeQuestionDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Resume {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer")
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ResumeQuestion> resumeQuestionList = new ArrayList<>();

    @Override
    public String toString() {
        return "Resume{" +
                "id=" + id +
                ", resumeQuestionList=" + resumeQuestionList +
                '}';
    }

    public List<ResumeQuestionDto> getResumeQuestionDtoList() {
        List<ResumeQuestionDto> resumeQuestionDtoList = this.getResumeQuestionList()
                .stream().map(ResumeQuestionDto::of).collect(Collectors.toList());
        return resumeQuestionDtoList;
    }
}
