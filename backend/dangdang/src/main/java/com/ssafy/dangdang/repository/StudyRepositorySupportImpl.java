package com.ssafy.dangdang.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.dangdang.domain.*;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.repository.support.Querydsl4RepositorySupport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;
import java.util.stream.Collectors;

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
    public List<StudyDto> getStudiesJoined(User registeredUser) {
        List<Study> studies = select(study)
                .from(study)
                .join(study.host, user).fetchJoin()
                .join(study.hashTags, studyHashTag).fetchJoin()
                .where(study.in(select(joins.study)
                        .from(joins)
                        .where(joins.user.eq(registeredUser)))).fetch();

        return studies.stream().map(StudyDto::of).collect(Collectors.toList());
    }

    @Override
    public Page<StudyDto> getStudiesJoinedWithPage(User registeredUser, Pageable pageable) {

        Page<Study> studys = applyPagination(pageable, contentQuery -> contentQuery
                        .selectDistinct(study)
                        .from(study)
                        .join(study.host, user).fetchJoin()
                        .join(study.hashTags, studyHashTag).fetchJoin()
                        .where(study.in(select(joins.study)
                                .from(joins)
                                .where(joins.user.eq(registeredUser))))
                , countQuery -> countQuery
                        .select(study.id)
                        .from(study)
                        .where(study.in(select(joins.study)
                                .from(joins)
                                .where(joins.user.eq(registeredUser)))));
        return studys.map(StudyDto::of);

    }

//    @Override
//    public List<Study> findFetchJoinStudyById(Long studyId) {
//
////    @Query("select s " +
////            "from Study s " +
////            "left join s.hashTags " +
////            "left join fetch s.joins " +
////            "where s.id = :studyId ")
//        List<Study> fetch = select(study)
//                .from(study)
//                .leftJoin(study.hashTags).fetchJoin()
//                .leftJoin(study.joins).fetchJoin()
//                .where(study.id.eq(studyId))
//                .fetch();
//        return fetch;
//
//    }


}
