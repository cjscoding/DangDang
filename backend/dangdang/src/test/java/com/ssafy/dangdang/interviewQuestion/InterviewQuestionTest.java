package com.ssafy.dangdang.interviewQuestion;

import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.repository.InterviewQuestionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class InterviewQuestionTest {

    @Autowired
    private InterviewQuestionRepository interviewQuestionRepository;

    @Test
    public void findAllInterviewQuestion(){
        List<InterviewQuestion> allInterviewQuestion = interviewQuestionRepository.findAllInterviewQuestion();
        System.out.println(allInterviewQuestion);
    }
}
