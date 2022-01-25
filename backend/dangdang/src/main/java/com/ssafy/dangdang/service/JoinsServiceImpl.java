package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Joins;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.repository.JoinsRepository;
import com.ssafy.dangdang.repository.StudyRepository;
import com.ssafy.dangdang.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class JoinsServiceImpl implements JoinsService {

    private final UserRepository userRepository;
    private final StudyRepository studyRepository;

    private final JoinsRepository joinsRepository;


    @Override
    public Long joinStudy(User user, Long studyId) {

        Study study = studyRepository.findById(studyId).get();
        Joins enter = Joins.builder()
                .user(user)
                .study(study)
                .build();

        joinsRepository.save(enter);

        return enter.getId();
    }

    @Override
    public void outStudy(User user, Long studyId) {
        Study study = studyRepository.findById(studyId).get();
        Joins enter = Joins.builder()
                .user(user)
                .study(study)
                .build();
        joinsRepository.delete(enter);
    }

    @Override
    public List<StudyDto> getStudies(User user){
        List<StudyDto> studies = studyRepository.getStudiesJoined(user);
        return studies;
       }

   @Override
    public Page<StudyDto> getStudiesJoinedWithPage(User user, Pageable pageable){
        return studyRepository.getStudiesJoinedWithPage(user, pageable);
    }
}
