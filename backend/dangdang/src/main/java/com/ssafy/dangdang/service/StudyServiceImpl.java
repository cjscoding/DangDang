package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudyServiceImpl implements StudyService{

    private final StudyRepository studyRepository;
    private final UserRepository userRepository;

    @Override
    public Study createStudy(Study study) {
        studyRepository.save(study);
        return study;
    }

    @Override
    public Study updateStudy( Study study) {
        studyRepository.save(study);
        return study;
    }

    @Override
    public ApiUtils.ApiResult<String> deleteStudy(User user, Long studyId) {
        Optional<Study> study = studyRepository.findById(studyId);
        if (!study.isPresent()) {
            log.error("존재하지 않는 스터디 삭제 요청");
            return (ApiUtils.ApiResult<String>) ApiUtils.error("존재하지 않는 스터디 입니다.", HttpStatus.NOT_FOUND);
        }
        if(study.get().getHost().getId() != user.getId()){
            log.error("권한없는 사용자의 삭제 요청");
            return (ApiUtils.ApiResult<String>) ApiUtils.error("권한이 없는 사용자입니다.", HttpStatus.FORBIDDEN);
        }

        studyRepository.delete(study.get());
        return ApiUtils.success("삭제 성공!");
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
