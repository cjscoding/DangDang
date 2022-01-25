package com.ssafy.dangdang.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(uniqueConstraints = {@UniqueConstraint(name = "USER_STUDY_QUIQUE", columnNames = {"user_id", "study_id"})})
public class Joins {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private  User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "study_id")
    private Study study;

    private Boolean waiting;

    public void acceptUser(){
        waiting = false;
    }

    @Override
    public String toString() {
        return "Joins{" +
                "id=" + id +
                ", user=" + user +
//                ", study=" + study +
                '}';
    }
}
