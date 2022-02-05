package com.ssafy.dangdang.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.ssafy.dangdang.domain.InterviewQuestion;

import com.ssafy.dangdang.domain.QInterviewQuestion;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.repository.support.Querydsl4RepositorySupport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import static com.ssafy.dangdang.domain.QInterviewQuestion.interviewQuestion;
import static com.ssafy.dangdang.domain.QUser.user;

public class InterviewQuestionSupportImpl extends Querydsl4RepositorySupport implements InterviewQuestionSupport{
    public InterviewQuestionSupportImpl() {
        super(InterviewQuestion.class);
    }

    @Override
    public Page<InterviewQuestion> findAllVisableInterviewQuestion(User writer, Pageable pageable) {
        //    @Query( value = "select i from InterviewQuestion i left join fetch i.writer " +
//            "where i.visable = true or i.writer.id = :writerId" ,
//            countQuery =  "select count(i.id) from InterviewQuestion  i " +
//                    "where i.visable = true or i.writer.id = :writerId" )
        Page<InterviewQuestion> interviewQuestions = applyPagination(pageable, contentQuery -> contentQuery
                        .selectFrom(interviewQuestion)
                        .join(interviewQuestion.writer, user).fetchJoin()
                        .where( isVisable().or(userEq(writer)) ),
                countQuery -> countQuery
                        .selectFrom(interviewQuestion)
                        .where( isVisable().or(userEq(writer)) )
        );
        return interviewQuestions;
    }

    private BooleanExpression isVisable(){
        return interviewQuestion.visable.eq(true);
    }

    private BooleanExpression userEq(User writer){
        return writer != null ? interviewQuestion.writer.eq(writer) : null;
    }

    private BooleanExpression isVisableOrUserEq(User writer){
        if (writer != null)
            return isVisable().or(userEq(writer));
        else return isVisable();
    }

}
