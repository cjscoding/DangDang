package com.ssafy.dangdang.resume;

import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.ResumeQuestion;
import com.ssafy.dangdang.domain.dto.ResumeDto;
import com.ssafy.dangdang.domain.projection.ResumeMapping;
import com.ssafy.dangdang.repository.ResumeRepository;
import com.ssafy.dangdang.service.ResumeService;
import org.hibernate.Hibernate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@SpringBootTest
public class ResumeServiceTest {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private ResumeRepository resumeRepository;

    @Test
    @Transactional
    public void getResume(){
        Resume resumeFetchJoinById = resumeRepository.findResumeFetchJoinByResumeId(1L);
        Hibernate.isInitialized(resumeFetchJoinById.getResumeQuestionList());
        ResumeDto resumeDto = ResumeDto.of(resumeFetchJoinById);
        System.out.println("=============================");
        System.out.println(resumeDto);
        System.out.println("=============================");
//        for (ResumeQuestion resumeQuestion:
//             resumeFetchJoinById.getResumeQuestionList()) {
//            System.out.println(resumeQuestion.toString());
//            System.out.println("=============================");
//        }
    }

    @Test
    @Transactional
    public void getResumes(){
        List<Resume> resumeDtos = resumeRepository.findResumeListFetchJoinByUserId(1L);


        System.out.println("=============================");
        for (Resume r:
                resumeDtos) {
            System.out.println(r);
            System.out.println("=============================");
        }

//        for (ResumeQuestion resumeQuestion:
//             resumeFetchJoinById.getResumeQuestionList()) {
//            System.out.println(resumeQuestion.toString());
//            System.out.println("=============================");
//        }
    }

}
