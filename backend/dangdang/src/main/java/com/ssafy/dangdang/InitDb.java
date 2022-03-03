package com.ssafy.dangdang;

import com.ssafy.dangdang.domain.Post;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.StudyHashTag;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.*;
import com.ssafy.dangdang.domain.types.CommentType;
import com.ssafy.dangdang.repository.CommentRepository;
import com.ssafy.dangdang.repository.StudyHashTagRepository;
import com.ssafy.dangdang.repository.StudyRepository;
import com.ssafy.dangdang.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.time.LocalDateTime;

@Component
@Profile("!(prod & common)")
@RequiredArgsConstructor
public class InitDb {

    private final InitService initService;


    @PostConstruct
    @Profile("!(prod & common)")
    public void init(){
        initService.signUpUsers();
        initService.createStudy();
        initService.join();
        initService.writeResume();
        initService.writeInterviewQuestion();
        initService.writePost();
        initService.writeComment();
        initService.makebookmarks();
    }

    //위 init()함수에 아래 내용을 전부 포함해도 된다고 생각할 수 있지만,
    //Bean의 생명주기 때문에, @Transactional같은 어노테이션을 사용하려면
    //아래와 같이 별도의 클래스를 사용해야한다.
    @Component
    @Profile("!(prod & common)")
    @Transactional
    @RequiredArgsConstructor
    static class InitService{
        private final UserService userService;
        private final StudyRepository studyRepository;
        private final StudyService studyService;
        private final JoinsService joinsService;
        private final ResumeService resumeService;
        private final InterviewQuestionService interviewQuestionService;
        private final PostService postService;
        private final StudyHashTagRepository hashTagRepository;
        private final CommentService commentService;
        private final CommentRepository commentRepository;
        private final InterviewBookmarkService interviewBookmarkService;

        public void signUpUsers(){
            UserDto userDto = new UserDto();

            userDto.setEmail("test@ssafy.com");
            userDto.setNickName("Bori");
            userDto.setPassword("test@ssafy.com");
            userService.signUpUser(userDto);
            userService.raiseToAdmin(1L);
            for (int i=0;i<20;i++){
                userDto = new UserDto();
                userDto.setEmail("test"+i+"@ssafy.com");
                userDto.setNickName("Bori"+i);
                userDto.setPassword("test"+i+"@ssafy.com");

                userService.signUpUser(userDto);
            }
        }

        public void createStudy(){
            User user = userService.findByEmail("test@ssafy.com").get();

            for (int i=1; i<12;i++){

                StudyDto studyDto = StudyDto.builder()
                        .name("testStudy"+i)
                        .description("안녕하세요!! 네이버 목표 스터디입니다.")
                        .goal("네이버")
                        .createdAt(LocalDateTime.now())
                        .number(3)
                        .build();
                System.out.println(user.toString());
//                entityManager.persist(Study.of(user, studyDto));
                studyService.createStudy(user, studyDto);

                Study createdStudy = studyService.findStudyById(Long.valueOf(i));
                System.out.println(createdStudy.toString());
                StudyHashTag hashTag1 = StudyHashTag.builder().hashTag("naver").study(createdStudy).build();
                StudyHashTag hashTag2 = StudyHashTag.builder().hashTag("네이버").study(createdStudy).build();
                StudyHashTag hashTag3 = StudyHashTag.builder().hashTag("kakao").study(createdStudy).build();
                StudyHashTag hashTag4 = StudyHashTag.builder().hashTag("카카오").study(createdStudy).build();
                hashTagRepository.save(hashTag1);
                hashTagRepository.save(hashTag2);
                hashTagRepository.save(hashTag3);
                hashTagRepository.save(hashTag4);

            }
        }

        public void join(){
//            User user = userService.findByEmail("test@ssafy.com").get();
//            for (long i=1;i<12;i++){
//                Study study = studyRepository.findById(i).get();
//                joinsService.joinStudy(user, i);
//            }

            for (long i=0;i<5;i++){
                User joinUser = userService.findByEmail("test"+i+"@ssafy.com").get();
                joinsService.joinStudy(joinUser, 1L);
            }
        }

        public void writeResume(){
            User user = userService.findByEmail("test@ssafy.com").get();
            ResumeDto resumeDto = new ResumeDto();
            ResumeQuestionDto resumeQuestionDto = new ResumeQuestionDto();
            resumeQuestionDto.setQuestion("파인애플피자 좋아함?");
            resumeQuestionDto.setAnswer("없어서 못먹음");
            resumeDto.getResumeQuestionList().add(resumeQuestionDto);
            resumeQuestionDto.setQuestion("파인애플피자 좋아함2?");
            resumeQuestionDto.setAnswer("없어서 못먹음2");
            resumeDto.getResumeQuestionList().add(resumeQuestionDto);
            resumeService.writeResume(user, 1L, resumeDto.getResumeQuestionList());
        }

        public void writeInterviewQuestion(){
            User user = userService.findByEmail("test@ssafy.com").get();
            for (int i=0;i<15;i++){
                InterviewQuestionDto interviewQuestionDto = InterviewQuestionDto.builder()
                        .question("민초 어떄요"+i)
                        .answer("너무 좋죠"+i)
                        .field("공통")
                        .job("IT")
                        .visable(true)
                        .build();
                interviewQuestionService.writeQuestion(user, interviewQuestionDto);
            }
            for (int i=0;i<6;i++){
                InterviewQuestionDto interviewQuestionDto = InterviewQuestionDto.builder()
                        .question("파인애플피자 어떄요"+i)
                        .answer("너무 좋죠"+i)
                        .field("공통")
                        .job("IT")
                        .visable(false)
                        .build();
                interviewQuestionService.writeQuestion(user, interviewQuestionDto);
            }

        }

        public void writePost(){
            User user = userService.findByEmail("test@ssafy.com").get();
            for (int i=0; i< 15;i++){
                PostDto postDto = PostDto.builder()
                        .title("제목제목"+i)
                        .content("내용내용")
                        .build();
                postService.writePost(user, postDto, 1L);
            }


        }

        public void writeComment(){
            commentRepository.deleteAll();
            User user = userService.findByEmail("test@ssafy.com").get();
            Post post = postService.findById(1L).get();
            for (int i =0;i<5;i++){
                CommentDto commentDto = CommentDto.builder()
                        .content("게시글댓글댓글"+i)
                        .writerId(user.getId())
                        .writerEmail(user.getEmail())
                        .writerNickname(user.getNickname())
                        .writerImageUrl(user.getImageUrl())
                        .referenceId(1L)
                        .commentType(CommentType.POST)
                        .depth(0)
                        .build();
                commentService.writeComment(user, commentDto);
                commentDto = CommentDto.builder()
                        .content("스터디 댓글댓글"+i)
                        .writerId(user.getId())
                        .writerEmail(user.getEmail())
                        .writerNickname(user.getNickname())
                        .writerImageUrl(user.getImageUrl())
                        .referenceId(1L)
                        .commentType(CommentType.STUDY)
                        .depth(0)
                        .build();
                commentService.writeComment(user, commentDto);
                commentDto = CommentDto.builder()
                        .content("자소서 댓글댓글"+i)
                        .writerId(user.getId())
                        .writerEmail(user.getEmail())
                        .writerNickname(user.getNickname())
                        .writerImageUrl(user.getImageUrl())
                        .referenceId(1L)
                        .commentType(CommentType.RESUME)
                        .depth(0)
                        .build();
                commentService.writeComment(user, commentDto);
            }
            Page<CommentDto> postComments = commentService.findCommentByReferenceIdWithPage(1L, CommentType.POST, PageRequest.of(0, 1));
            Page<CommentDto> studyComments = commentService.findCommentByReferenceIdWithPage(1L, CommentType.STUDY, PageRequest.of(0, 1));
            Page<CommentDto> resumeComments = commentService.findCommentByReferenceIdWithPage(1L, CommentType.RESUME, PageRequest.of(0, 1));

            String postParentId = postComments.getContent().get(0).getId();
            String studyParentId = studyComments.getContent().get(0).getId();
            String resumeParentId = resumeComments.getContent().get(0).getId();
            for (int i =0;i<5;i++){
                CommentDto commentDto = CommentDto.builder()
                        .content("게시글 대댓글!!!!!"+i)
                        .writerId(user.getId())
                        .writerEmail(user.getEmail())
                        .writerNickname(user.getNickname())
                        .writerImageUrl(user.getImageUrl())
                        .parentId(postParentId)
                        .referenceId(1L)
                        .commentType(CommentType.POST)
                        .depth(1)
                        .build();
                commentService.writeComment(user, commentDto);
                commentDto = CommentDto.builder()
                        .content("스터디 대댓글!!!!!"+i)
                        .writerId(user.getId())
                        .writerEmail(user.getEmail())
                        .writerNickname(user.getNickname())
                        .writerImageUrl(user.getImageUrl())
                        .parentId(studyParentId)
                        .referenceId(1L)
                        .commentType(CommentType.STUDY)
                        .depth(1)
                        .build();
                commentService.writeComment(user, commentDto);
                commentDto = CommentDto.builder()
                        .content("자소서 대댓글!!!!!"+i)
                        .writerId(user.getId())
                        .writerEmail(user.getEmail())
                        .writerNickname(user.getNickname())
                        .writerImageUrl(user.getImageUrl())
                        .parentId(resumeParentId)
                        .referenceId(1L)
                        .commentType(CommentType.RESUME)
                        .depth(1)
                        .build();
                commentService.writeComment(user, commentDto);
            }



        }

        public void makebookmarks(){
            User user = userService.findByEmail("test@ssafy.com").get();

            for (long i=1;i<=5;i++){
                interviewBookmarkService.makeBookmark(user, i);
            }
        }

    }

}
