package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.InterviewQuestionDto;
import com.ssafy.dangdang.util.ApiUtils;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface InterviewQuestionService {

    public InterviewQuestionDto writeQuestion(User user, InterviewQuestionDto interviewQuestionDto);

    ApiUtils.ApiResult<String> deleteQuestion(User user, Long interviewQuestionId);

    Optional<InterviewQuestion> findById(Long id);



    Page<InterviewQuestionDto> getAllInterviewQustion(@ParameterObject Pageable pageable);

    @Transactional
    Page<InterviewQuestionDto> getAllVisableInterviewQustion(User writer, Pageable pageable);

    void makePublic(Long interviewId);

    @Transactional
    void hide(Long interviewId);

    Page<InterviewQuestionDto> getMyQuestion(User writer, Pageable pageable);

}
