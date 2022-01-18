package com.ssafy.dangdang.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.dangdang.domain.Study;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public class StudyRepositorySupportImpl extends QuerydslRepositorySupport implements StudyRepositorySupport  {

    public StudyRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Study.class);
    }


}
