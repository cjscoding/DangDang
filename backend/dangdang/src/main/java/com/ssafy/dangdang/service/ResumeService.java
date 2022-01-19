package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.ResumeQuestion;
import com.ssafy.dangdang.domain.User;

import java.util.List;

public interface ResumeService {

    public Resume writeResume(User user, List<ResumeQuestion> resumeQuestionList);

    public Resume updateResume(User user);

}
