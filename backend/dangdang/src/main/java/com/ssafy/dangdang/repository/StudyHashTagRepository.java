package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.StudyHashTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface StudyHashTagRepository extends JpaRepository<StudyHashTag, Long> {


}
