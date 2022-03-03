package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Joins;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.exception.BadRequestException;
import com.ssafy.dangdang.exception.ExceedFixedNumber;
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
    public Boolean getJoin(User user, Long studyId){
        Optional<Joins> join = joinsRepository.findJoinsByUserIdAndStudyId(user.getId(), studyId);
        // 가입 신청을 하지 않았거나 이미 가입되었으면 false
        if (!join.isPresent()) return false;
        if (join.get().getWaiting()) return true;
        return false;
    }

    @Override
    public Long joinStudy(User user, Long studyId) {

        Optional<Joins> join = joinsRepository.findJoinsByUserIdAndStudyId(user.getId(), studyId);
        if(join.isPresent() && join.get().getWaiting())  {
            log.info("가입 신청 취소");
            joinsRepository.delete(join.get());
            return 0L;
        }

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
        Joins join = joinsRepository.findJoinsByUserIdAndStudyId(userId, studyId).get();
        Optional<Study> study = studyRepository.findById(studyId);
        if(!study.isPresent()) throw new NullPointerException("존재하지 않는 스터디 입니다.");
        if (study.get().getHost().getId() != host.getId()) throw new UnauthorizedAccessException("스터디장만이 유저를 가입시킬 수 있습니다.");

        List<Joins> joins = study.get().getJoins();
        // 가입 완료된 유저만 조회
        List<User> users = joins.stream().filter(j -> !j.getWaiting())
                .map(j -> j.getUser()).collect(Collectors.toList());
        if (users.size() >= study.get().getNumber()) throw new ExceedFixedNumber("이미 정원이 다 찬 스터디입니다.") ;

        join.acceptUser();
        return join.getId();
    }

    @Override
    @Transactional
    public List<UserDto> getWaitingUser(User host, Long studyId){

        Optional<Study> study = studyRepository.findById(studyId);
        if(!study.isPresent()) throw new NullPointerException("존재하지 않는 스터디 입니다.");
        if (!study.get().getHost().getId().equals(host.getId())) throw new UnauthorizedAccessException("스터디장만 가입 대기자들을 확인할 수 있습니다.");
        List<User> waitingUsers = userRepository.findWaitingUsers(studyId);
        List<UserDto> waitingUserDtos = waitingUsers.stream().map(UserDto::of).collect(Collectors.toList());
        return waitingUserDtos;
    }

    @Override
    public void outStudy(User user, Long studyId) {
        Study study = studyRepository.findById(studyId).get();
        if (study.getHost().getId().equals(user.getId())) throw new BadRequestException("스터디장은 스터디를 탈퇴할 수 없습니다.");
        
        Joins enter = joinsRepository.findJoinsByUserIdAndStudyId(user.getId(), studyId).get();
        joinsRepository.delete(enter);
    }

    @Override
    public void outStudy(User user, Long userId, Long studyId) {
        Study study = studyRepository.findById(studyId).get();
        if (!study.getHost().getId().equals(user.getId())) throw new UnauthorizedAccessException("스터디장만이 유저를 내보낼 수 있습니다.");
        
        Joins enter = joinsRepository.findJoinsByUserIdAndStudyId(userId, studyId).get();
        joinsRepository.delete(enter);
    }

    @Override
    @Transactional
    public List<StudyDto> getStudies(User user, List<String> hasgTags){
        List<Study> studies = studyRepository.getStudiesJoined(user, hasgTags);

        return studies.stream().map(StudyDto::of).collect(Collectors.toList());
    }

   @Override
   @Transactional
    public Page<StudyDto> getStudiesJoinedWithPage(User user,List<String> hasgTags, Pageable pageable){
       Page<Study> studies = studyRepository.getStudiesJoinedWithPage(user, hasgTags, pageable);
       return studies.map(StudyDto::of) ;
    }
}
