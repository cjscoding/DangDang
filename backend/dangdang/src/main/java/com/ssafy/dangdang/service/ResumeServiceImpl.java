package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Comment;
import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.ResumeQuestion;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.ResumeDto;
import com.ssafy.dangdang.domain.dto.ResumeQuestionDto;
import com.ssafy.dangdang.domain.types.CommentType;
import com.ssafy.dangdang.exception.UnauthorizedAccessException;
import com.ssafy.dangdang.repository.CommentRepository;
import com.ssafy.dangdang.repository.ResumeQuestionRepository;
import com.ssafy.dangdang.repository.ResumeRepository;
import com.ssafy.dangdang.util.ApiUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.ssafy.dangdang.util.ApiUtils.error;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeServiceImpl implements ResumeService{

    private final ResumeRepository resumeRepository;
    private final ResumeQuestionRepository resumeQuestionRepository;

    private final CommentRepository commentRepository;

    @Override
    @Transactional
    public Resume writeResume(User user, List<ResumeQuestionDto> resumeQuestionDtoList) {
        Resume resume = Resume.builder()
                .user(user)
                .resumeQuestionList(new ArrayList<>())
                .build();
        resumeRepository.save(resume);
        for ( ResumeQuestionDto resumeQuestionDto:
                resumeQuestionDtoList) {
            ResumeQuestion resumeQuestion = ResumeQuestion.of(resume, resumeQuestionDto);
            // Front로 resumeQuestionList를 함께 보냄, 이 외래키가 ResumeQuestion에 있기에, 이 코드를 생략해도 DB에 영향을 끼치지 않음
            resume.getResumeQuestionList().add(resumeQuestion);
            resumeQuestionRepository.save(resumeQuestion);
        }
        return resume;
    }

    @Override
    @Transactional
    public Resume updateResume(User user, ResumeDto resumeDto) {
        Resume resume = resumeRepository.findById(resumeDto.getId()).get();

        for ( ResumeQuestionDto resumeQuestionDto:
                resumeDto.getResumeQuestionList()) {
            ResumeQuestion resumeQuestion = ResumeQuestion.of(resume, resumeQuestionDto);
            resumeQuestionRepository.save(resumeQuestion);
        }
        resumeRepository.save(resume);
        resume = resumeRepository.findResumeFetchJoinByResumeId(resumeDto.getId());
        return resume;
    }

    @Override
    @Transactional
    public ApiUtils.ApiResult<String> deleteResume(User user, Long resumeId) {
        Optional<Resume> resume = resumeRepository.findById(resumeId);
        if(!resume.isPresent()) throw new NullPointerException("존재하지 않는 자소서 입니다.");
        if (resume.get().getUser().getId() == user.getId())
            throw new UnauthorizedAccessException("자신의 자소서만 삭제할 수 있습니다.");
        List<Comment> comments = commentRepository.findAllByReferenceIdAndDepthAndCommentType(resumeId, 0, CommentType.RESUME);
        comments.forEach(commentRepository::recurDelete);

        resumeRepository.delete(resume.get());
        return ApiUtils.success("삭제 성공");
    }

    @Override
    @Transactional
    public List<ResumeDto> getResumes(Long userId){
        List<Resume> resumes = resumeRepository.findResumeListFetchJoinByUserId(userId);
        List<ResumeDto> resumeDtos = resumes.stream().map(ResumeDto::of).collect(Collectors.toList());
        return resumeDtos;
    }

    @Override
    public Optional<Resume> getResume(Long resumeId) {
        return resumeRepository.findById(resumeId);
    }
}
