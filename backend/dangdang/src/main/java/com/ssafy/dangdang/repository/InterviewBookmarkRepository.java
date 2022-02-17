package com.ssafy.dangdang.repository;


import com.ssafy.dangdang.domain.InterviewBookmark;

import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.projection.InterviewBookmarkMapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.List;

@EnableJpaRepositories
public interface InterviewBookmarkRepository extends JpaRepository<InterviewBookmark, Long> {

    InterviewBookmark findInterviewBookmarkByUserIdAndInterviewQuestionId(Long userId, Long interviewQuestionId);

    List<InterviewBookmark> findInterviewBookmarksByInterviewQuestionId(Long interviewQuestionId);

    List<InterviewBookmark> findInterviewBookmarksByUserId(Long userId);

    @Query(value = "select ib.interviewQuestion from InterviewBookmark ib" +
            "  group by ib.interviewQuestion " +
            "order by count(ib.interviewQuestion) desc",
    countQuery = "select  count(distinct ib.interviewQuestion) from InterviewBookmark ib")
    Page<InterviewQuestion> findRecommends(Pageable pageable);
}
