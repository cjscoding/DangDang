package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StudyRepositorySupport {

   // void createStudy(User user, StudyDto studyDto);

    public List<StudyDto> getStudiesJoined(User user);

    Page<StudyDto> getStudiesJoinedWithPage(User user, Pageable pageable);

//    public List<Study> findFetchJoinStudyById(Long studyId);

}
