package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.ResumeQuestion;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.ResumeDto;
import com.ssafy.dangdang.domain.dto.ResumeQuestionDto;
import com.ssafy.dangdang.domain.projection.ResumeMapping;
import com.ssafy.dangdang.util.ApiUtils;

import java.util.List;
import java.util.Optional;

public interface ResumeService {

    public Resume writeResume(User user, List<ResumeQuestionDto> resumeQuestionDtoList);

    public Resume updateResume(User user, ResumeDto resumeDto);

    public ApiUtils.ApiResult<String> deleteResume(User user, Long resumeId);

    public List<ResumeMapping> getResumes(Long userId);

    public Optional<Resume> getResume(Long resumeId);

}
