package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.InterviewQuestionDto;

import java.util.List;

public interface InterviewBookmarkService {

    public Long makeBookmark(User user, Long interviewId);

    public void delete(User user, Long interviewId);

    public List<InterviewQuestionDto> getInterviewBookmarks(User user);

}
