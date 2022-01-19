package com.ssafy.dangdang.study;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.types.Email;
import com.ssafy.dangdang.repository.StudyRepository;
import com.ssafy.dangdang.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class StudyServiceTest {

    @Autowired
    private StudyRepository studyRepository;
    @Autowired
    private UserRepository userRepository;


    @Test
    public void getStudies(){

        User user = userRepository.findUserByEmail(Email.of("test@ssafy.com")).get();
        List<Study> studies = studyRepository.getStudies(user);

        System.out.println(studies);
    }

}
