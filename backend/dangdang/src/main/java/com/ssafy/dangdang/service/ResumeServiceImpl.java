package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.*;
import com.ssafy.dangdang.domain.dto.ResumeDto;
import com.ssafy.dangdang.domain.dto.ResumeQuestionDto;
import com.ssafy.dangdang.domain.types.CommentType;
import com.ssafy.dangdang.exception.UnauthorizedAccessException;
import com.ssafy.dangdang.repository.*;
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
    private final JoinsRepository joinsRepository;
    private final ResumeQuestionRepository resumeQuestionRepository;
    private final StudyRepository studyRepository;
    private final CommentRepository commentRepository;

    @Override
    @Transactional
    public ResumeDto writeResume(User user, Long studyId, List<ResumeQuestionDto> resumeQuestionDtoList) {
        Optional<Study> study = studyRepository.findById(studyId);
        if(!study.isPresent()) throw new NullPointerException("존재하지 않는 스터디 입니다");
        Optional<Joins> join = joinsRepository.findJoinsByUserIdAndStudyId(user.getId(), studyId);
        if (!join.isPresent()) throw new UnauthorizedAccessException("스터디 회원만 자소서를 작성할 수 있습니다.");

        Resume resume = Resume.builder()
                .user(user)
                .study(study.get())
                .resumeQuestionList(new ArrayList<>())
                .build();
        resumeRepository.save(resume);
        for ( ResumeQuestionDto resumeQuestionDto:
                resumeQuestionDtoList) {
            resumeQuestionDto.setId(null);
            ResumeQuestion resumeQuestion = ResumeQuestion.of(resume, resumeQuestionDto);
            // Front로 resumeQuestionList를 함께 보냄, 이 외래키가 ResumeQuestion에 있기에, 이 코드를 생략해도 DB에 영향을 끼치지 않음
            resume.getResumeQuestionList().add(resumeQuestion);
            resumeQuestionRepository.save(resumeQuestion);
        }
        return ResumeDto.of(resume);
    }

    @Override
    @Transactional
    public ResumeDto updateResume(User user,Long studyId, ResumeDto resumeDto) {

        Optional<Study> study = studyRepository.findById(studyId);
        if(!study.isPresent()) throw new NullPointerException("존재하지 않는 스터디 입니다");
        Optional<Joins> join = joinsRepository.findJoinsByUserIdAndStudyId(user.getId(), studyId);
        if (!join.isPresent()) throw new UnauthorizedAccessException("스터디 회원만 자소서를 수정 할 수 있습니다.");

        Optional<Resume> byId = resumeRepository.findById(resumeDto.getId());
        if(!byId.isPresent()) throw new NullPointerException("존재하지 않는 자소서 입니다.");
        Resume resume = byId.get();
        for ( ResumeQuestionDto resumeQuestionDto:
                resumeDto.getResumeQuestionList()) {
            ResumeQuestion resumeQuestion = ResumeQuestion.of(resume, resumeQuestionDto);
            resumeQuestionRepository.save(resumeQuestion);
        }
        resumeRepository.save(resume);
        resume = resumeRepository.findResumeFetchJoinByResumeId(resumeDto.getId());
        return ResumeDto.of(resume);
    }

    @Override
    @Transactional
    public ApiUtils.ApiResult<String> deleteResume(User user, Long studyId, Long resumeId) {

        Optional<Study> study = studyRepository.findById(studyId);
        if(!study.isPresent()) throw new NullPointerException("존재하지 않는 스터디 입니다");
        Optional<Joins> join = joinsRepository.findJoinsByUserIdAndStudyId(user.getId(), studyId);
        if (!join.isPresent()) throw new UnauthorizedAccessException("스터디 회원만 자소서를 수정 할 수 있습니다.");

        Optional<Resume> resume = resumeRepository.findById(resumeId);
        if(!resume.isPresent()) throw new NullPointerException("존재하지 않는 자소서 입니다.");
        if (resume.get().getUser().getId() != user.getId())
            throw new UnauthorizedAccessException("자신의 자소서만 삭제할 수 있습니다.");
        List<Comment> comments = commentRepository.findAllByReferenceIdAndDepthAndCommentType(resumeId, 0, CommentType.RESUME);
        comments.forEach(commentRepository::recurDelete);

        resumeRepository.delete(resume.get());
        return ApiUtils.success("삭제 성공");
    }

    @Override
    @Transactional
    public List<ResumeDto> getResumes(Long userId, Long studyId){
        List<Resume> resumes = resumeRepository.findResumeList(userId, studyId);
        List<ResumeDto> resumeDtos = resumes.stream().map(ResumeDto::of).collect(Collectors.toList());
        return resumeDtos;
    }

    @Override
    public Optional<Resume> getResume(Long resumeId) {
        return resumeRepository.findById(resumeId);
    }
}
