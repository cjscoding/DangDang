package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.List;

@EnableJpaRepositories
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {


    @Query("select i from InterviewQuestion  i left join fetch i.writer")
    public List<InterviewQuestion> findAllInterviewQuestion();
}
