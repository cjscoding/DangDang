package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.ResumeQuestion;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.ResumeDto;
import com.ssafy.dangdang.domain.dto.ResumeQuestionDto;
import com.ssafy.dangdang.domain.projection.ResumeMapping;
import com.ssafy.dangdang.repository.ResumeQuestionRepository;
import com.ssafy.dangdang.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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
    public boolean deleteResume(Long id) {
        resumeRepository.delete(Resume.builder().id(id).build());

        return true;
    }

    @Override
    @Transactional
    public List<ResumeMapping> getResumes(Long userId){
      return resumeRepository.findResumeListFetchJoinByUserId(userId);
    }
}
