package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.StudyHashTag;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.repository.JoinsRepository;
import com.ssafy.dangdang.repository.StudyHashTagRepository;
import com.ssafy.dangdang.repository.StudyRepository;
import com.ssafy.dangdang.repository.UserRepository;
import com.ssafy.dangdang.util.ApiUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.ssafy.dangdang.util.ApiUtils.*;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudyServiceImpl implements StudyService{

    private final StudyRepository studyRepository;
    private final StudyHashTagRepository hashTagRepository;
    private final UserRepository userRepository;
    private final JoinsRepository joinsRepository;

    @Override
    public StudyDto createStudy(User user, StudyDto studyDto) {
        Study study = Study.of(user, studyDto);
        studyRepository.save(study);
        if (studyDto.getHashTags() !=null && !studyDto.getHashTags().isEmpty()){
            List<StudyHashTag> hashTags = studyDto.getHashTags()
                    .stream()
                    .map(s->StudyHashTag.builder().id(s.getId()).study(study).hashTag(s.getHashTag()).build())
                    .collect(Collectors.toList());
            hashTagRepository.saveAll(hashTags);
        }

        StudyDto createdStudy = StudyDto.of(study);
        return createdStudy;
    }

    @Override
    public ApiResult<StudyDto> updateStudy(User user, StudyDto studyDto) {
        Optional<Study> findStudy = studyRepository.findById(studyDto.getId());
        if(!findStudy.isPresent()) return (ApiResult<StudyDto>) error("존재하지 않는 스터디 입니다.", HttpStatus.NOT_FOUND);
        List<User> studyUsers = userRepository.findUserByStudyId(studyDto.getId());

        for (User studyUser:
             studyUsers) {
            if(user.getId() == studyUser.getId()){
                Study study = Study.of(user, studyDto);
                studyRepository.save(study);
                StudyDto updatedStudy = StudyDto.of(study);
                return success(updatedStudy);
            }
        }

        return (ApiResult<StudyDto>) error("권한이 없는 사용자입니다.", HttpStatus.FORBIDDEN);


    }

    @Override
    public ApiResult<String> deleteStudy(User user, Long studyId) {
        Optional<Study> study = studyRepository.findById(studyId);
        if (!study.isPresent()) {
            log.error("존재하지 않는 스터디 삭제 요청");
            return (ApiResult<String>) error("존재하지 않는 스터디 입니다.", HttpStatus.NOT_FOUND);
        }
        if(study.get().getHost().getId() != user.getId()){
            log.error("권한없는 사용자의 삭제 요청");
            return (ApiUtils.ApiResult<String>) error("권한이 없는 사용자입니다.", HttpStatus.FORBIDDEN);
        }

        studyRepository.delete(study.get());
        return success("삭제 성공!");
    }

    @Override
    public Page<StudyDto> getAllStudies(Pageable pageable) {
        Page<Study> studies = studyRepository.findAllWithUser(pageable);

        Page<StudyDto> studyDtos = studies.map(StudyDto::of);
        return studyDtos;
    }

    @Override
    public Study getStudy(Long studyId) {
        return studyRepository.getById(studyId);
    }
}
