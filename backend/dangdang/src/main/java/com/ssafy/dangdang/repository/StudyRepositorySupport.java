package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StudyRepositorySupport {

   // void createStudy(User user, StudyDto studyDto);

    //public List<Study> getStudiesJoined(User user);

    //Page<Study> getStudiesJoinedWithPage(User user, Pageable pageable);


    Page<Study> findStudiesByHashtags(List<String> hashtags, Pageable pageable);

//    public List<Study> findFetchJoinStudyById(Long studyId);

    Page<Study> getStudiesJoinedWithPage(User registeredUser,List<String> hashtags,  Pageable pageable);
    List<Study> getStudiesJoined(User registeredUser, List<String> hashtags);
}
