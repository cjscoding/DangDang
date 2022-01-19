package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.ResumeQuestion;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.ResumeDto;
import com.ssafy.dangdang.domain.dto.ResumeQuestionDto;
import com.ssafy.dangdang.domain.projection.ResumeMapping;

import java.util.List;

public interface ResumeService {

    public Resume writeResume(User user, List<ResumeQuestionDto> resumeQuestionDtoList);

    public Resume updateResume(User user, ResumeDto resumeDto);

    public boolean deleteResume(Long id);

    public List<ResumeMapping> getResumes(Long userId);

}
