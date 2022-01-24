package com.ssafy.dangdang.study;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.repository.StudyRepository;
import com.ssafy.dangdang.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@SpringBootTest
public class StudyServiceTest {

    @Autowired
    private StudyRepository studyRepository;
    @Autowired
    private UserRepository userRepository;


    @Test
    public void getStudiesJoined(){

        User user = userRepository.findUserByEmail("test@ssafy.com").get();
        List<StudyDto> studies = studyRepository.getStudiesJoined(user);

        System.out.println(studies);
    }

    @Test
    public void getStudiesJoinedWithPage(){

        User user = userRepository.findUserByEmail("test@ssafy.com").get();
        Page<StudyDto> allWithUser = studyRepository.getStudiesJoinedWithPage(user, PageRequest.of(0, 10));

        System.out.println(allWithUser.getContent());
    }

    @Test
    public void joinTest(){
        List<Study> studies = studyRepository.testJoin();
        System.out.println(studies);
    }
}
