package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.InterviewQuestionDto;
import com.ssafy.dangdang.exception.UnauthorizedAccessException;
import com.ssafy.dangdang.repository.InterviewQuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.ssafy.dangdang.util.ApiUtils.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class InterviewQuestionServiceImpl implements InterviewQuestionService{


    private final InterviewQuestionRepository interviewQuestionRepository;

    @Override
    public InterviewQuestionDto writeQuestion(User user, InterviewQuestionDto interviewQuestionDto) {

        InterviewQuestion interviewQuestion = InterviewQuestion.of(interviewQuestionDto, user);
        interviewQuestionRepository.save(interviewQuestion);
        return InterviewQuestionDto.of(interviewQuestion);
    }

    @Override
    public ApiResult<String> deleteQuestion(User user, Long interviewQuestionId) {
        Optional<InterviewQuestion> question = interviewQuestionRepository.findById(interviewQuestionId);

        if (!question.isPresent()) throw new NullPointerException("존재하지 않는 질문 입니다.");
        if (question.get().getWriter().getId() != user.getId()) new UnauthorizedAccessException("작성자만이 삭제할 수 있습니다.");
        interviewQuestionRepository.delete(question.get());
        return success("삭제 성공");
    }

    @Override
    public Optional<InterviewQuestion> findById(Long id){
        return interviewQuestionRepository.findById(id);
    }

    @Override
    @Transactional
    public Page<InterviewQuestionDto> getAllInterviewQustion(Pageable pageable){
        Page<InterviewQuestion> all = interviewQuestionRepository.findAllInterviewQuestion(pageable);
        Page<InterviewQuestionDto> interviewQuestionDtos = all.map(InterviewQuestionDto::of);
        return interviewQuestionDtos;
    }

    @Override
    @Transactional
    public Page<InterviewQuestionDto> getAllVisableInterviewQustion(User writer, Pageable pageable){
        Page<InterviewQuestion> all = interviewQuestionRepository.findAllVisableInterviewQuestion(writer, pageable);
        Page<InterviewQuestionDto> interviewQuestionDtos = all.map(InterviewQuestionDto::of);
        return interviewQuestionDtos;
    }

    @Override
    @Transactional
    public void makePublic(Long interviewId){
        Optional<InterviewQuestion> interview = interviewQuestionRepository.findById(interviewId);
        if (!interview.isPresent()) throw new NullPointerException("존재하지 않는 질문 입니다.");
        interview.get().makePubic();
    }

    @Override
    @Transactional
    public void hide(Long interviewId){
        Optional<InterviewQuestion> interview = interviewQuestionRepository.findById(interviewId);
        if (!interview.isPresent()) throw new NullPointerException("존재하지 않는 질문 입니다.");
        interview.get().hide();
    }

    @Override
    @Transactional
    public Page<InterviewQuestionDto> getMyQuestion(User writer, Pageable pageable) {
        Page<InterviewQuestion> all = interviewQuestionRepository.findAllByWriter(writer.getId(), pageable);
        Page<InterviewQuestionDto> interviewQuestionDtos = all.map(InterviewQuestionDto::of);
        return interviewQuestionDtos;
    }

}
