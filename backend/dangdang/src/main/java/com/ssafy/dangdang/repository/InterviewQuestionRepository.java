package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.InterviewQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.List;

@EnableJpaRepositories
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {


    @Query( value = "select i from InterviewQuestion  i left join fetch i.writer",
    countQuery = "select count(i.id) from InterviewQuestion  i")
    public Page<InterviewQuestion> findAllInterviewQuestion(Pageable pageable);

    @Query("select i from InterviewQuestion  i left join fetch i.writer " +
            "where i.visable = true")
    public List<InterviewQuestion> findAllVisableInterviewQuestion();
}
