package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.*;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.domain.types.CommentType;
import com.ssafy.dangdang.exception.UnauthorizedAccessException;
import com.ssafy.dangdang.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static com.ssafy.dangdang.util.ApiUtils.*;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudyServiceImpl implements StudyService{

    private final StudyRepository studyRepository;
    private final StudyHashTagRepository hashTagRepository;
    private final UserRepository userRepository;
    private final JoinsRepository joinsRepository;
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional
    public StudyDto createStudy(User user, StudyDto studyDto) {
        Study study = Study.of(user, studyDto);
        studyRepository.save(study);
        if (studyDto.getHashTags() !=null && !studyDto.getHashTags().isEmpty()){
            System.out.println();
            List<StudyHashTag> hashTags = studyDto.getHashTags()
                    .stream()
                    .map(s->StudyHashTag.builder().study(study).hashTag(s).build())
                    .collect(Collectors.toList());
            hashTagRepository.saveAll(hashTags);
            study.addHashTags(hashTags);
        }

        Joins enter = Joins.builder()
                .user(user)
                .study(study)
                .waiting(false)
                .build();
        joinsRepository.save(enter);

        StudyDto createdStudyDto = StudyDto.of(study);
        return createdStudyDto;
    }

    @Override
    @Transactional
    public StudyDto updateStudy(User user, StudyDto studyDto) {
        Optional<Study> findStudy = studyRepository.findById(studyDto.getId());
        if(!findStudy.isPresent()) throw new NullPointerException("존재하지 않는 스터디 입니다.");
        Integer count = userRepository.countUserByStudyId(user.getId(), studyDto.getId());

        if(count ==0) throw new UnauthorizedAccessException("권한이 없는 사용자의 요청입니다.");

        List<StudyHashTag> oldHashTags = findStudy.get().getHashTags();
        hashTagRepository.deleteAll(oldHashTags);
        Study study = Study.builder()
                .id(studyDto.getId())
                .name(studyDto.getName())
                .number(studyDto.getNumber())
                .goal(studyDto.getGoal())
                .openKakao(studyDto.getOpenKakao())
                .description(studyDto.getDescription())
                .createdAt(findStudy.get().getCreatedAt())
                .host(findStudy.get().getHost())
                .lastAccessTime(LocalDateTime.now())
                .build();
        studyRepository.save(study);
        if (studyDto.getHashTags() !=null && !studyDto.getHashTags().isEmpty()){
            List<StudyHashTag> hashTags = studyDto.getHashTags()
                    .stream()
                    .map(s->StudyHashTag.builder().study(findStudy.get()).hashTag(s).build())
                    .collect(Collectors.toList());
            hashTagRepository.saveAll(hashTags);
            study.addHashTags(hashTags);
        }

        StudyDto updatedStudy = StudyDto.of(study);
        return updatedStudy;
    }

    @Override
    @Transactional
    public ApiResult<String> deleteStudy(User user, Long studyId) {
        Optional<Study> study = studyRepository.findById(studyId);
        if (!study.isPresent()) {
            log.error("존재하지 않는 스터디 삭제 요청");
            throw new NullPointerException("존재하지 않는 스터디 입니다.");
        }
        if(study.get().getHost().getId() != user.getId()){
            log.error("권한없는 사용자의 삭제 요청");
            throw new UnauthorizedAccessException("권한이 없는 사용자의 요청입니다.");
        }

        List<StudyHashTag> hashTags = study.get().getHashTags();
        hashTagRepository.deleteAll(hashTags);

        List<Post> posts = postRepository.findPostByStudyId(studyId);
        postRepository.deleteAll(posts);

        List<Comment> comments = commentRepository.findAllByReferenceIdAndDepthAndCommentType(studyId, 0, CommentType.STUDY);
        comments.forEach(commentRepository::recurDelete);

        List<Joins> joins = joinsRepository.findJoinsByStudyId(studyId);
        joinsRepository.deleteAll(joins);

        studyRepository.delete(study.get());
        return success("삭제 성공!");
    }

    @Override
    @Transactional
    public Page<StudyDto> getAllStudies(Pageable pageable) {
        Page<Study> studies = studyRepository.findAllWithUser(pageable);
        Page<StudyDto> studyDtos = studies.map(StudyDto::of);
        return studyDtos;
    }

    @Override
    public Study findStudyById(Long studyId) {
        return studyRepository.findStudyById(studyId);
    }

    @Override
    @Transactional
    public StudyDto findStudyWithUsers(Long studyId){
        Study study = studyRepository.findStudyById(studyId);
        StudyDto studyDto = StudyDto.of(study);
        return studyDto;
    }
}
