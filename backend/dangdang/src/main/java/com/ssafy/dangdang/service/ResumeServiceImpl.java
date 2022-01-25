package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.ResumeQuestion;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.ResumeDto;
import com.ssafy.dangdang.domain.dto.ResumeQuestionDto;
import com.ssafy.dangdang.domain.projection.ResumeMapping;
import com.ssafy.dangdang.repository.ResumeQuestionRepository;
import com.ssafy.dangdang.repository.ResumeRepository;
import com.ssafy.dangdang.util.ApiUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.ssafy.dangdang.util.ApiUtils.error;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeServiceImpl implements ResumeService{

    private final ResumeRepository resumeRepository;
    private final ResumeQuestionRepository resumeQuestionRepository;


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
    public ApiUtils.ApiResult<String> deleteResume(User user, Long resumeId) {
        Optional<Resume> resume = resumeRepository.findById(resumeId);
        if(!resume.isPresent()) return (ApiUtils.ApiResult<String>) error("존재하지 않는 자소서 입니다.", HttpStatus.BAD_REQUEST);
        if (resume.get().getUser().getId() == user.getId())
            return (ApiUtils.ApiResult<String>) error("자신의 자소서만 삭제할 수 있습니다.",
                HttpStatus.FORBIDDEN);

            resumeRepository.delete(resume.get());
        return ApiUtils.success("삭제 성공");
    }

    @Override
    @Transactional
    public List<ResumeMapping> getResumes(Long userId){
      return resumeRepository.findResumeListFetchJoinByUserId(userId);
    }

    @Override
    public Optional<Resume> getResume(Long resumeId) {
        return resumeRepository.findById(resumeId);
    }
}
