package com.ssafy.dangdang.repository;


import com.ssafy.dangdang.domain.InterviewBookmark;

import com.ssafy.dangdang.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.List;

@EnableJpaRepositories
public interface InterviewBookmarkRepository extends JpaRepository<InterviewBookmark, Long> {

    InterviewBookmark findInterviewBookmarkByUserIdAndInterviewQuestionId(Long userId, Long interviewQuestionId);


    @Query(value = "select ib from InterviewBookmark ib" +
            "  group by ib.interviewQuestion.id " +
            "order by count(ib.id) desc",
    countQuery = "select count(ib) from InterviewBookmark ib" +
            "  group by ib.interviewQuestion.id")
    Page<InterviewBookmark> findRecommends(Pageable pageable);
}
