package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.repository.StudyRepository;
import com.ssafy.dangdang.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudyServiceImpl implements StudyService{

    private final StudyRepository studyRepository;
    private final UserRepository userRepository;

    @Override
    public Study createStudy(User user, Study study) {
        log.info(user.toString());
        studyRepository.save(study);
        return study;
    }

    @Override
    public Study updateStudy(User user, Study Study) {
        return null;
    }

    @Override
    public boolean deleteStudy(User user, Study Study) {
        return false;
    }


    @Override
    public Page<StudyDto> getAllStudies() {
        return null;
    }
}
