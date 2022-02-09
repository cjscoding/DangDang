package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.ResumeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface ResumeQuestionRepository extends JpaRepository<ResumeQuestion, Long> {
}
