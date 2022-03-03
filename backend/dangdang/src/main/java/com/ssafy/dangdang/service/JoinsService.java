package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.domain.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface
JoinsService {


    Boolean getJoin(User user, Long studyId);

    public Long joinStudy(User user, Long studyId);

    List<UserDto> getWaitingUser(User host, Long studyId);

    public void outStudy(User user, Long studyId);
    public Long acceptUser(User host, Long userId, Long studyId);

    void outStudy(User user, Long userId, Long studyId);

    List<StudyDto> getStudies(User user, List<String> hasgTags);

    Page<StudyDto> getStudiesJoinedWithPage(User user, List<String> hasgTags, Pageable pageable);
}
