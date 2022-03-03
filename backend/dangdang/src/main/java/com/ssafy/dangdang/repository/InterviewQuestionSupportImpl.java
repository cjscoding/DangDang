package com.ssafy.dangdang.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.ssafy.dangdang.domain.InterviewQuestion;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.WriteInterview;
import com.ssafy.dangdang.domain.types.InterviewField;
import com.ssafy.dangdang.domain.types.InterviewJob;
import com.ssafy.dangdang.exception.BadRequestException;
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

    @Override
    public Page<InterviewQuestion> searchInterviewQuestion(User writer, WriteInterview searchParam, Pageable pageable) {
        Page<InterviewQuestion> interviewQuestions = applyPagination(pageable, contentQuery -> contentQuery
                        .selectFrom(interviewQuestion)
                        .join(interviewQuestion.writer, user).fetchJoin()
                        .where( isVisable().or(userEq(writer)),
                                fieldEq(searchParam.getField()),
                                jobEq(searchParam.getJob()),
                                questionContains(searchParam.getQuestion()),
                                answerContains(searchParam.getAnswer()) ),
                countQuery -> countQuery
                        .selectFrom(interviewQuestion)
                        .where( isVisable().or(userEq(writer)),
                                fieldEq(searchParam.getField()),
                                jobEq(searchParam.getJob()),
                                questionContains(searchParam.getQuestion()),
                                answerContains(searchParam.getAnswer()) )
        );
        return interviewQuestions;
    }

    @Override
    public Page<InterviewQuestion> adminSearchInterviewQuestion(WriteInterview searchParam, Pageable pageable) {
        Page<InterviewQuestion> interviewQuestions = applyPagination(pageable, contentQuery -> contentQuery
                        .selectFrom(interviewQuestion)
                        .join(interviewQuestion.writer, user).fetchJoin()
                        .where( fieldEq(searchParam.getField()),
                                jobEq(searchParam.getJob()),
                                questionContains(searchParam.getQuestion()),
                                answerContains(searchParam.getAnswer()) ),
                countQuery -> countQuery
                        .selectFrom(interviewQuestion)
                        .where( fieldEq(searchParam.getField()),
                                jobEq(searchParam.getJob()),
                                questionContains(searchParam.getQuestion()),
                                answerContains(searchParam.getAnswer()) )
        );
        return interviewQuestions;
    }

    @Override
    public Page<InterviewQuestion> searchMine(User writer, WriteInterview searchParam, Pageable pageable) {
        if (writer == null) throw new BadRequestException("로그인을 해주세요");
        Page<InterviewQuestion> interviewQuestions = applyPagination(pageable, contentQuery -> contentQuery
                        .selectFrom(interviewQuestion)
                        .join(interviewQuestion.writer, user).fetchJoin()
                        .where( userEq(writer ),
                                fieldEq(searchParam.getField()),
                                jobEq(searchParam.getJob()),
                                questionContains(searchParam.getQuestion()),
                                answerContains(searchParam.getAnswer()) ),
                countQuery -> countQuery
                        .selectFrom(interviewQuestion)
                        .where( userEq(writer),
                                fieldEq(searchParam.getField()),
                                jobEq(searchParam.getJob()),
                                questionContains(searchParam.getQuestion()),
                                answerContains(searchParam.getAnswer()) )
        );
        return interviewQuestions;
    }

    private BooleanExpression fieldEq(String field){
        return field != null ? interviewQuestion.field.eq(InterviewField.valueOf(field)) : null;
    }
    private BooleanExpression jobEq(String job){
        return job != null ? interviewQuestion.job.eq(InterviewJob.valueOf(job)) : null;
    }
    private BooleanExpression questionContains(String question){
        return question != null ? interviewQuestion.question.contains(question) : null;
    }
    private BooleanExpression answerContains(String answer){
        return answer != null ? interviewQuestion.answer.contains(answer) : null;
    }

    private BooleanExpression isVisable(){
        return interviewQuestion.visable.eq(true);
    }

    private BooleanExpression userEq(User writer){
        return writer != null ? interviewQuestion.writer.eq(writer) : null;
    }



}
