package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Enter;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.domain.types.Email;
import com.ssafy.dangdang.repository.EnterRepository;
import com.ssafy.dangdang.repository.StudyRepository;
import com.ssafy.dangdang.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class EnterServiceImpl implements EnterService{

    private final UserRepository userRepository;
    private final StudyRepository studyRepository;

    private final EnterRepository enterRepository;


    @Override
    @Transactional
    public Long enterStudy(UserDto userDto, Long studyId) {

        User user = userRepository.findUserByEmail(Email.of(userDto.getEmail())).get();
        Study study = studyRepository.findById(studyId).get();
        Enter enter = Enter.builder()
                .user(user)
                .study(study)
                .build();

        enterRepository.save(enter);

        return enter.getId();
    }
}
