package com.ssafy.dangdang.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.dangdang.domain.QUser;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.repository.support.Querydsl4RepositorySupport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;

import static com.querydsl.jpa.JPAExpressions.select;

import static com.ssafy.dangdang.domain.QJoins.joins;
import static com.ssafy.dangdang.domain.QStudy.study;
import static com.ssafy.dangdang.domain.QUser.user;

public class StudyRepositorySupportImpl extends Querydsl4RepositorySupport implements StudyRepositorySupport  {


    public StudyRepositorySupportImpl() {
        super(Study.class);
    }


    @Override
    public List<StudyDto> getStudiesJoined(User user) {
        List<StudyDto> studies = select(Projections.constructor(StudyDto.class,
                        study.id, study.name, study.number, study.introduction, study.createdAt, study.target,
                                study.host.id, study.host.nickname, study.host.email))
                .from(study)
                .where(study.in(select(joins.study)
                        .from(joins)
                        .where(joins.user.eq(user)))).fetch();
        return studies;
    }

    @Override
    public Page<StudyDto> getStudiesJoinedWithPage(User registeredUser, Pageable pageable) {

        Page<StudyDto> studyDtos = applyPagination(pageable, contentQuery -> contentQuery
                        .select(Projections.constructor(StudyDto.class,
                                study.id, study.name, study.number, study.introduction, study.createdAt, study.target
                                , study.host.id, study.host.nickname, study.host.email))
                        .from(study)
                        .join(study.host, user)
                        .where(study.in(select(joins.study)
                                .from(joins)
                                .where(joins.user.eq(registeredUser))))
                , countQuery -> countQuery
                        .select(Projections.constructor(StudyDto.class,
                                study.id, study.name, study.number, study.introduction, study.createdAt, study.target
                                , study.host.id, study.host.nickname, study.host.email))
                        .from(study)
                        .join(study.host, user)
                        .where(study.in(select(joins.study)
                                .from(joins)
                                .where(joins.user.eq(registeredUser)))));
        return studyDtos;
//        List<StudyDto> studies = select(Projections.constructor(StudyDto.class,
//                        study.id, study.name, study.number, study.introduction, study.createdAt, study.target
//        ,study.host.id, study.host.nickname, study.host.email))
//                .from(study)
//                .join(study.host, user)
//                .where(study.in(select(joins.study)
//                        .from(joins)
//                        .where(joins.user.eq(registeredUser))))
//                .offset(pageable.getOffset())
//                .limit(pageable.getPageSize())
//                .fetch();
//
//        System.out.println("total: "+studies.size());
//        return new PageImpl<>(studies, pageable, studies.size());
    }

//    @Override
//    public Page<StudyDto> getAllStudies(User user) {
//        JPAQueryFactory jpaQueryFactory = new JPAQueryFactory(getEntityManager());
//        List<Study> studies = queryFactory.selectFrom(study)
//                .where(study.in(select(joins.study)
//                        .from(joins)
//                        .where(joins.user.eq(user)))).fetch();
//
//        return studies;
//    }
}
