package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.InterviewQuestion;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.WriteInterview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InterviewQuestionSupport {


//    @Query( value = "select i from InterviewQuestion i left join fetch i.writer " +
//            "where i.visable = true or i.writer.id = :writerId" ,
//            countQuery =  "select count(i.id) from InterviewQuestion  i " +
//                    "where i.visable = true or i.writer.id = :writerId" )
    public Page<InterviewQuestion> findAllVisableInterviewQuestion(User writer, Pageable pageable);

    Page<InterviewQuestion> searchInterviewQuestion(User writer, WriteInterview searchParam, Pageable pageable);

    Page<InterviewQuestion> searchMine(User writer, WriteInterview searchParam, Pageable pageable);
}
