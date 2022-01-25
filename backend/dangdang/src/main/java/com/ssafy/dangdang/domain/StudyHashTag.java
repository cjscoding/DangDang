package com.ssafy.dangdang.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.dangdang.domain.dto.StudyHashTagDto;
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
public class StudyHashTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "study_id")
    private Study study;

    @Column(length = 30)
    private String hashTag;

    public static StudyHashTag of(StudyHashTagDto hashTagDto){
        return StudyHashTag.builder()
                .id(hashTagDto.getId())
                .hashTag(hashTagDto.getHashTag())
                .build();
    }

    public static StudyHashTag of(String hashTag){
        return StudyHashTag.builder()
                .hashTag(hashTag)
                .build();
    }

}
