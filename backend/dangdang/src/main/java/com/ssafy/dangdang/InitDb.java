package com.ssafy.dangdang;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.InterviewQuestionDto;
import com.ssafy.dangdang.domain.dto.ResumeDto;
import com.ssafy.dangdang.domain.dto.ResumeQuestionDto;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.repository.StudyRepository;
import com.ssafy.dangdang.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class InitDb {

    private final InitService initService;


    @PostConstruct
    public void init(){
        initService.signUpUsers();
        initService.createStudy();
        initService.enter();
        initService.writeResume();
        initService.writeInterviewQuestion();
    }

    //위 init()함수에 아래 내용을 전부 포함해도 된다고 생각할 수 있지만,
    //Bean의 생명주기 때문에, @Transactional같은 어노테이션을 사용하려면
    //아래와 같이 별도의 클래스를 사용해야한다.
    @Component
    @Transactional
    @RequiredArgsConstructor
    static class InitService{
        private final UserService userService;
        private final StudyRepository studyRepository;
        private final StudyService studyService;
        private final JoinsService enterService;
        private final ResumeService resumeService;
        private final InterviewQuestionService interviewQuestionService;

        public void signUpUsers(){
            UserDto userDto = new UserDto();

            userDto.setEmail("test@ssafy.com");
            userDto.setNickName("Bori");
            userDto.setPassword("test@ssafy.com");
            userService.signUpUser(userDto);
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

            for (int i=0; i<12;i++){

                Study study = Study.builder()
                        .name("testStudy"+i)
                        .introduction("안녕하세요!! 네이버 목표 스터디입니다.")
                        .target("네이버")
                        .createdAt(LocalDateTime.now())
                        .number(3)
                        .host(user)
                        .build();
                System.out.println(user.toString());
//                entityManager.persist(Study.of(user, studyDto));
                studyService.createStudy(study);
            }
        }


        public void enter(){
            User user = userService.findByEmail("test@ssafy.com").get();
            for (long i=1;i<12;i++){
                Study study = studyRepository.findById(i).get();
                enterService.enterStudy(user, i);
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
            resumeService.writeResume(user, resumeDto.getResumeQuestionList());
        }

        public void writeInterviewQuestion(){
            User user = userService.findByEmail("test@ssafy.com").get();
            for (int i=0;i<15;i++){
                InterviewQuestionDto interviewQuestionDto = InterviewQuestionDto.builder()
                        .question("민초 어떄요"+i)
                        .answer("너무 좋죠"+i)
                        .field("공통")
                        .visable(false)
                        .build();
                interviewQuestionService.writerQuestion(user, interviewQuestionDto);
            }

        }

    }

}
