package com.ssafy.dangdang.repository;


import com.ssafy.dangdang.domain.InterviewBookmark;

import com.ssafy.dangdang.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.List;

@EnableJpaRepositories
public interface InterviewBookmarkRepository extends JpaRepository<InterviewBookmark, Long> {

    InterviewBookmark findInterviewBookmarkByUserIdAndInterviewQuestionId(Long userId, Long interviewQuestionId);


}
