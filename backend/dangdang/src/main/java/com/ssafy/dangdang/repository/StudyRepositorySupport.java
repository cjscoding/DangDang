package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;

import java.util.List;

public interface StudyRepositorySupport {

   // void createStudy(User user, StudyDto studyDto);

    public List<Study> getStudies(User user);

}
