package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.util.ApiUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudyService {


    public StudyDto createStudy(User user, StudyDto studyDto);

    public StudyDto updateStudy(User user, StudyDto studyDto);

    public ApiUtils.ApiResult<String> deleteStudy(User user, Long studyId);

    public Page<StudyDto> getAllStudies(Pageable pageable);


    Study findStudyById(Long studyId);

    StudyDto findStudyWithUsers(Long studyId);
}
