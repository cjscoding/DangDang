package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface JoinsService {



    public Long joinStudy(User user, Long studyId);

    public void outStudy(User user, Long studyId);

    List<StudyDto> getStudies(User user);

    Page<StudyDto> getStudiesJoinedWithPage(User user, Pageable pageable);
}
