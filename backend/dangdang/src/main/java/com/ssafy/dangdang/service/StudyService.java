package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.util.ApiUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface StudyService {


    public StudyDto createStudy(User user, StudyDto studyDto);

    public StudyDto updateStudy(User user, StudyDto studyDto);

    public ApiUtils.ApiResult<String> deleteStudy(User user, Long studyId);

    @Transactional
    Page<StudyDto> getAllStudies(List<String> hashTags, Pageable pageable);

    Study findStudyById(Long studyId);

    StudyDto findStudyWithUsers(Long studyId);

    @Transactional
    void uploadImage(User user, Long studyId, String uuid, MultipartFile file);

    String getImageUrl(Long studyId);
}
