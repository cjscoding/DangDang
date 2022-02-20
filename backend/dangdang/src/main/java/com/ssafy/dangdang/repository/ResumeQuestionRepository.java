package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.ResumeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.List;

@EnableJpaRepositories
public interface ResumeQuestionRepository extends JpaRepository<ResumeQuestion, Long> {

    List<ResumeQuestion> findAllByResume(Resume resume);
}
