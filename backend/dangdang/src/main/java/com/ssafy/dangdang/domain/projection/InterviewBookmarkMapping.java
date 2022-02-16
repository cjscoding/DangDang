package com.ssafy.dangdang.domain.projection;

import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.domain.User;
import lombok.Getter;


public interface InterviewBookmarkMapping {

    Long getId();

    User getUser();
    InterviewQuestion getInterviewQuestion();
//    Integer getBookmarkCount();
}
