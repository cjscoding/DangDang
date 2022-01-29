package com.ssafy.dangdang.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.ssafy.dangdang.domain.*;
import com.ssafy.dangdang.repository.support.Querydsl4RepositorySupport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static com.querydsl.jpa.JPAExpressions.select;

import static com.querydsl.jpa.JPAExpressions.selectDistinct;
import static com.ssafy.dangdang.domain.QJoins.joins;
import static com.ssafy.dangdang.domain.QStudy.study;
import static com.ssafy.dangdang.domain.QStudyHashTag.studyHashTag;
import static com.ssafy.dangdang.domain.QUser.user;

public class StudyRepositorySupportImpl extends Querydsl4RepositorySupport implements StudyRepositorySupport  {


    public StudyRepositorySupportImpl() {
        super(Study.class);
    }


    @Override
    public List<Study> getStudiesJoined(User registeredUser, List<String> hashtags) {
        List<Study> studies = select(study)
                .from(study)
                .join(study.host, user).fetchJoin()
          //      .join(study.hashTags, studyHashTag).fetchJoin() //일대다 컬랙션 페이지네이션을 위해 지연로딩으로 처리함
                .where(isJoinedUser(registeredUser),
                        containsHashTags(hashtags) ).fetch();

        return studies;
    }

    @Override
    public Page<Study> getStudiesJoinedWithPage(User registeredUser,List<String> hashtags,  Pageable pageable) {

        Page<Study> studies = applyPagination(pageable, contentQuery -> contentQuery
                        .selectDistinct(study)
                        .from(study)
                        .join(study.host, user).fetchJoin()
            //            .join(study.hashTags, studyHashTag).fetchJoin()
                        .where( isJoinedUser(registeredUser),
                                containsHashTags(hashtags))
                , countQuery -> countQuery
                        .select(study.id)
                        .from(study)
                        .where(isJoinedUser(registeredUser),
                                containsHashTags(hashtags)));
        return studies ;

    }

    @Override
    public Page<Study> findStudiesByHashtags(List<String> hashtags, Pageable pageable){

        Page<Study> studies = applyPagination(pageable, contentQuery -> contentQuery
                        .selectDistinct(study)
                        .from(study)
                        .join(study.host, user).fetchJoin()
                        .where(containsHashTags(hashtags))
                , countQuery -> countQuery
                        .selectDistinct(study)
                        .from(study)
                        .join(study.host, user).fetchJoin()
                        .where(containsHashTags(hashtags) ));
        return studies ;
    }


    private BooleanExpression uesrEq(User registeredUser){
        return registeredUser != null ? joins.user.eq(registeredUser) : null;
    }

    private BooleanExpression waitingEqFalse(){
        return joins.waiting.eq(false);
    }


    private BooleanExpression isJoinedUser(User registeredUser){
       return study.in(select(joins.study)
                .from(joins)
                .where(uesrEq(registeredUser).and(waitingEqFalse()))) ;

    }

    private BooleanExpression containsHashTags(List<String> hashtags){
        if (hashtags == null || hashtags.isEmpty()) return null;

        return study.in(select(studyHashTag.study)
                .from(studyHashTag)
                .where( studyHashTag.hashTag.in(hashtags))) ;
    }







}
