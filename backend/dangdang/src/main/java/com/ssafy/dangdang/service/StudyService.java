package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;

public interface StudyService {

    public StudyDto createStudy(User user, StudyDto studyDto);
}
