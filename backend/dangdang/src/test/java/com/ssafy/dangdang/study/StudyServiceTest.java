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
import org.springframework.security.core.parameters.P;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class StudyServiceTest {

    @Autowired
    private StudyRepository studyRepository;
    @Autowired
    private UserRepository userRepository;


    @Test
    @Transactional
    public void getStudiesJoined(){

        User user = userRepository.findUserByEmail("test@ssafy.com").get();
        List<Study> studies = studyRepository.getStudiesJoined(user, null);

        System.out.println(studies);
    }

    @Test
    @Transactional
    public void getStudiesJoinedWithPage(){

        User user = userRepository.findUserByEmail("test@ssafy.com").get();

        List<String> hashtags = new ArrayList<>();
        hashtags.add("naver");

        Page<Study> allWithUser = studyRepository.getStudiesJoinedWithPage(user, hashtags, PageRequest.of(0, 10));

        System.out.println(allWithUser.getContent());
    }

    @Test
    @Transactional // Test는 영속성컨텍스트의 생존 범위가 아니므로 이 어노테이션이 있어야 지연로딩을 할 수 있다.
    public void findStudyById(){

        Study fetchJoinStudyById = studyRepository.findStudyById(1L);

        System.out.println(fetchJoinStudyById);
    }

    @Test
    @Transactional
    public void findStudyByHasgTags(){
        List<String> hashtags = new ArrayList<>();
        hashtags.add("naver");
        Page<Study> studies = studyRepository.findStudiesByHashtags(hashtags, PageRequest.of(0, 10));

        System.out.println(studies.getContent());
    }


}
