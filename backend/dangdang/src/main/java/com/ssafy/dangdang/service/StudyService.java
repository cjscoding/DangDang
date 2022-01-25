package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.util.ApiUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StudyService {

    public Study createStudy(Study study);

    public Study updateStudy(Study study);

    public ApiUtils.ApiResult<String> deleteStudy(User user, Long studyId);

    public Page<StudyDto> getAllStudies(Pageable pageable);

    public Study getStudy(Long studyId);
}
