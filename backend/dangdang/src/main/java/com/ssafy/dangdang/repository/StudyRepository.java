package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.core.parameters.P;

import java.util.List;

@EnableJpaRepositories
public interface StudyRepository extends JpaRepository<Study, Long>, StudyRepositorySupport {


    @Query(value = "select s from  Study s "+
            "left join fetch s.host ",
    countQuery = "select count(s.id) from Study  s")
    public Page<Study> findAllWithUser(Pageable pageable);

    @Query("select s " +
            "from Study s " +
            "left join fetch s.host " +
            "where s.id = :studyId ")
    public Study findStudyById(Long studyId);

}
