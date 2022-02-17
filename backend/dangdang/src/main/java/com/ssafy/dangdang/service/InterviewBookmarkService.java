package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.InterviewQuestionDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface InterviewBookmarkService {

    public Long makeBookmark(User user, Long interviewId);

    public void delete(User user, Long interviewId);

    public Page<InterviewQuestionDto> getInterviewBookmarks(User user, Pageable pageable);

    @Transactional
    Page<InterviewQuestionDto> getRecommends(Pageable pageable);
}
