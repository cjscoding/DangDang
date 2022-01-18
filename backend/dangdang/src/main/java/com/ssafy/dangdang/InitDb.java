package com.ssafy.dangdang;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.repository.StudyRepository;
import com.ssafy.dangdang.service.EnterService;
import com.ssafy.dangdang.service.StudyService;
import com.ssafy.dangdang.service.UserService;
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
    }

    //위 init()함수에 아래 내용을 전부 포함해도 된다고 생각할 수 있지만,
    //Bean의 생명주기 때문에, @Transactional같은 어노테이션을 사용하려면
    //아래와 같이 별도의 클래스를 사용해야한다.
    @Component
    @RequiredArgsConstructor
    static class InitService{
        private final UserService userService;
        private final StudyRepository studyRepository;
        private final StudyService studyService;
        private final EnterService enterService;


        @Transactional
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

        @Transactional
        public void createStudy(){
            User user = userService.findByEmail("test@ssafy.com");

            for (int i=0; i<10;i++){

                StudyDto studyDto = StudyDto.builder()
                        .name("testStudy"+i)
                        .introduction("안녕하세요!! 네이버 목표 스터디입니다.")
                        .target("네이버")
                        .createdAt(LocalDateTime.now())
                        .number(3)
                        .build();
                System.out.println(user.toString());
//                entityManager.persist(Study.of(user, studyDto));
                studyService.createStudy(user, studyDto);
            }
        }

        public void enter(){
            User user = userService.findByEmail("test@ssafy.com");
            Study study = studyRepository.findById(1L).get();
            enterService.enterStudy(UserDto.of(user), 1L);

        }

    }

}
