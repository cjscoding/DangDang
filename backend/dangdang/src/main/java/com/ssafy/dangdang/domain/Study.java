package com.ssafy.dangdang.domain;

import com.ssafy.dangdang.domain.dto.StudyDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Study {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30)
    private String name;

    @Lob //스터디 소개글
    private String introduction;

    private LocalDateTime createdAt;

    private Integer number;

    @ManyToOne(fetch = FetchType.LAZY) //스터디 만든사람
    @JoinColumn(name = "host_id")
    private User host;

    @OneToMany(mappedBy = "study")
    private List<Enter> enters = new ArrayList<>();

    @Column(length = 30) //목표하는 기업
    private String target;

    private Integer totalTime;
    private LocalDateTime lastAccessTime;

    public static Study of(User user, StudyDto studyDto) {
        return Study.builder()
                .name(studyDto.getName())
                .createdAt(LocalDateTime.now())
                .number(studyDto.getNumber())
                .target(studyDto.getTarget())
                .introduction(studyDto.getIntroduction())
                .host(user)
                .totalTime(0)
                .lastAccessTime(LocalDateTime.now())
                .build();

    }

    public void setHost(User host) {
        this.host = host;
    }
}
