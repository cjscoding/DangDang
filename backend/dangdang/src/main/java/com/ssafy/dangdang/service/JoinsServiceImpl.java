package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Joins;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.exception.BadRequestException;
import com.ssafy.dangdang.exception.UnauthorizedAccessException;
import com.ssafy.dangdang.repository.JoinsRepository;
import com.ssafy.dangdang.repository.StudyRepository;
import com.ssafy.dangdang.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
                .waiting(true)
                .build();
        joinsRepository.save(enter);
        return enter.getId();
    }

    @Override
    @Transactional
    public Long acceptUser(User host, Long userId, Long studyId){
        Joins joins = joinsRepository.findJoinsByUserIdAndStudyId(userId, studyId);
        Optional<Study> study = studyRepository.findById(studyId);
        if(!study.isPresent()) throw new NullPointerException("존재하지 않는 스터디 입니다.");
        if (study.get().getHost().getId() != host.getId()) throw new UnauthorizedAccessException("스터디장만이 유저를 가입시킬 수 있습니다.");
        joins.acceptUser();
        return joins.getId();
    }

    @Override
    @Transactional
    public List<UserDto> getWaitingUser(User host, Long studyId){

        Optional<Study> study = studyRepository.findById(studyId);
        if(!study.isPresent()) throw new NullPointerException("존재하지 않는 스터디 입니다.");
        if (!study.get().getHost().getId().equals(host.getId())) throw new UnauthorizedAccessException("스터디장만 가입 대기자들을 확인할 수 있습니다.");
        List<User> waitingUesrs = userRepository.findWaitingUesrs(studyId);
        List<UserDto> waitingUserDtos = waitingUesrs.stream().map(UserDto::of).collect(Collectors.toList());
        return waitingUserDtos;
    }

    @Override
    public void outStudy(User user, Long studyId) {
        Study study = studyRepository.findById(studyId).get();
        Joins enter = joinsRepository.findJoinsByUserIdAndStudyId(user.getId(), studyId);
        System.out.println(study.getHost().getId());
        System.out.println(user.getId());
        if (study.getHost().getId().equals(user.getId())) throw new BadRequestException("스터디장은 스터디를 탈퇴할 수 없습니다.");
        joinsRepository.delete(enter);
    }

    @Override
    @Transactional
    public List<StudyDto> getStudies(User user){
        List<StudyDto> studies = studyRepository.getStudiesJoined(user);
        return studies;
       }

   @Override
   @Transactional
    public Page<StudyDto> getStudiesJoinedWithPage(User user, Pageable pageable){
        return studyRepository.getStudiesJoinedWithPage(user, pageable);
    }
}
