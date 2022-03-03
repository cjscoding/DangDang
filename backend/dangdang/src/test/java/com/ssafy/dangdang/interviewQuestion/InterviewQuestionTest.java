package com.ssafy.dangdang.interviewQuestion;

import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.repository.InterviewQuestionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@SpringBootTest
public class InterviewQuestionTest {

    @Autowired
    private InterviewQuestionRepository interviewQuestionRepository;

    @Test
    public void findAllInterviewQuestion(){
        Page<InterviewQuestion> allInterviewQuestion = interviewQuestionRepository.findAllInterviewQuestion(PageRequest.of(0,10));
        System.out.println(allInterviewQuestion);
    }
}
