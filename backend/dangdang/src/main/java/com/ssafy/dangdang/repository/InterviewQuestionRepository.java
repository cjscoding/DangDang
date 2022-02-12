package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;

import java.util.List;

@EnableJpaRepositories
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long>, InterviewQuestionSupport {


    @Query( value = "select i from InterviewQuestion i left join fetch i.writer",
    countQuery = "select count(i.id) from InterviewQuestion  i")
    public Page<InterviewQuestion> findAllInterviewQuestion(Pageable pageable);


    @Query( value = "select i from InterviewQuestion i left join fetch i.writer " +
            "where i.writer.id = :writerId",
            countQuery =  "select count(i.id) from InterviewQuestion  i " +
                    "where i.writer.id = :writerId" )
    public Page<InterviewQuestion> findAllByWriter(@Param("writerId") Long writerId, Pageable pageable);

    @Query(
            value = "select i from InterviewQuestion i " +
                    "where i.id in (select ib.interviewQuestion.id from InterviewBookmark ib " +
                    "where  ib.user.id = :userId)"
    )
    public List<InterviewQuestion> findInterviewBookmark(@Param("userId") Long userId);
}
