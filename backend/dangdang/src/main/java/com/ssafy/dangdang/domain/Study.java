package com.ssafy.dangdang.domain;

import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.domain.dto.StudyHashTagDto;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Study {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30)
    private String name;

    @Lob //스터디 소개글
    private String description;

    //오픈카톡방 주소
    private String openKakao;

    private String imageUrl;


    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private Integer number;

    @ManyToOne(fetch = FetchType.LAZY) //스터디 만든사람
    @JoinColumn(name = "host_id")
    @ToString.Exclude
    private User host;

    @OneToMany(mappedBy = "study")
    @Builder.Default
    private List<Joins> joins = new ArrayList<>();

    @Column(length = 30) //목표하는 기업
    private String goal;

    @OneToMany(mappedBy = "study",fetch = FetchType.LAZY)
    @Builder.Default
    private List<StudyHashTag> hashTags = new ArrayList<>();

    private Integer totalTime;

    @Builder.Default
    private LocalDateTime lastAccessTime = LocalDateTime.now();

    public static Study of(User user, StudyDto studyDto) {
        if(studyDto.getHashTags()!= null && studyDto.getHashTags().isEmpty()){
            List<StudyHashTag> hashTags = studyDto.getHashTags().stream().map(StudyHashTag::of).collect(Collectors.toList());
            return Study.builder()
                    .name(studyDto.getName())
                    .createdAt(LocalDateTime.now())
                    .number(studyDto.getNumber())
                    .goal(studyDto.getGoal())
                    .openKakao(studyDto.getOpenKakao())
                    .hashTags(hashTags)
                    .description(studyDto.getDescription())
                    .host(user)
                    .totalTime(0)
                    .lastAccessTime(LocalDateTime.now())
                    .build();
        }

        return Study.builder()
                .name(studyDto.getName())
                .createdAt(LocalDateTime.now())
                .number(studyDto.getNumber())
                .goal(studyDto.getGoal())
                .openKakao(studyDto.getOpenKakao())
                .description(studyDto.getDescription())
                .host(user)
                .totalTime(0)
                .lastAccessTime(LocalDateTime.now())
                .build();


    }

    public void addHashTags(List<StudyHashTag> studyHashTags){
        this.hashTags = studyHashTags;
    }
    public void addImageUrl(String path){ this.imageUrl = path;}

}
