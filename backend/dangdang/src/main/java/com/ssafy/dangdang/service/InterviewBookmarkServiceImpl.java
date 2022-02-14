package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.InterviewBookmark;
import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.InterviewQuestionDto;
import com.ssafy.dangdang.repository.InterviewBookmarkRepository;
import com.ssafy.dangdang.repository.InterviewQuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class InterviewBookmarkServiceImpl implements InterviewBookmarkService{

    private final InterviewBookmarkRepository bookmarkRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;

    @Override
    public Long makeBookmark(User user, Long interviewId) {
        Optional<InterviewQuestion> question = interviewQuestionRepository.findById(interviewId);
        if(!question.isPresent()) throw new NullPointerException("존재하지 않는 질문 입니다.");
        InterviewBookmark interviewBookmark = InterviewBookmark.of(user, question.get());
        return bookmarkRepository.save(interviewBookmark).getId();
    }

    @Override
    public void delete(User user, Long interviewId) {
        InterviewBookmark bookmark = bookmarkRepository.findInterviewBookmarkByUserIdAndInterviewQuestionId(user.getId(), interviewId);
        bookmarkRepository.delete(bookmark);
    }

    @Override
    @Transactional
    public Page<InterviewQuestionDto> getInterviewBookmarks(User user, Pageable pageable) {
        Page<InterviewQuestion> bookmarks  = interviewQuestionRepository.findInterviewBookmark(user.getId(), pageable);
        return bookmarks.map(interview -> InterviewQuestionDto.of(interview));
    }
}
