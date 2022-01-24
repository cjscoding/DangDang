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
    private String description;

    //오픈카톡방 주소
    private String openKakao;


    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private Integer number;

    @ManyToOne(fetch = FetchType.LAZY) //스터디 만든사람
    @JoinColumn(name = "host_id")
    private User host;

    @OneToMany(mappedBy = "study")
    @Builder.Default
    private List<Joins> enters = new ArrayList<>();

    @Column(length = 30) //목표하는 기업
    private String goal;

    @OneToMany(mappedBy = "study",fetch = FetchType.LAZY)
    @Builder.Default
    private List<StudyHashTag> hashTags = new ArrayList<>();

    private Integer totalTime;

    @Builder.Default
    private LocalDateTime lastAccessTime = LocalDateTime.now();

    public static Study of(User user, StudyDto studyDto) {
        return Study.builder()
                .name(studyDto.getName())
                .createdAt(LocalDateTime.now())
                .number(studyDto.getNumber())
                .goal(studyDto.getGoal())
                .openKakao(studyDto.getOpenKakao())
                .hashTags(studyDto.getHashTags())
                .description(studyDto.getDescription())
                .host(user)
                .totalTime(0)
                .lastAccessTime(LocalDateTime.now())
                .build();

    }


    @Override
    public String toString() {
        return "Study{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", openKakao='" + openKakao + '\'' +
                ", createdAt=" + createdAt +
                ", number=" + number +
                ", goal='" + goal + '\'' +
                ", hashTags=" + hashTags +
                ", totalTime=" + totalTime +
                ", lastAccessTime=" + lastAccessTime +
                '}';
    }
}
