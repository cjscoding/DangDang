package com.ssafy.dangdang.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;

import static com.querydsl.jpa.JPAExpressions.select;
import static com.ssafy.dangdang.domain.QEnter.enter;
import static com.ssafy.dangdang.domain.QStudy.study;

public class StudyRepositorySupportImpl extends QuerydslRepositorySupport implements StudyRepositorySupport  {

    private final JPAQueryFactory queryFactory;

    public StudyRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Study.class);
        this.queryFactory = queryFactory;
    }


    @Override
    public List<Study> getStudies(User user) {
        JPAQueryFactory jpaQueryFactory = new JPAQueryFactory(getEntityManager());
        List<Study> studies = queryFactory.selectFrom(study)
                .where(study.in(select(enter.study)
                        .from(enter)
                        .where(enter.user.eq(user)))).fetch();

        return studies;
    }
}
