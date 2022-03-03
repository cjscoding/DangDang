package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.ResumeDto;
import com.ssafy.dangdang.domain.dto.ResumeQuestionDto;
import com.ssafy.dangdang.util.ApiUtils;

import java.util.List;
import java.util.Optional;

public interface ResumeService {

    public ResumeDto writeResume(User user, Long studyId, List<ResumeQuestionDto> resumeQuestionDtoList);

    public ResumeDto updateResume(User user,Long studyId, ResumeDto resumeDto);

    public ApiUtils.ApiResult<String> deleteResume(User user, Long studyId, Long resumeId);

    public List<ResumeDto> getResumes(Long userId,Long studyId);

    public Optional<Resume> getResume(Long resumeId);

}
