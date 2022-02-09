package com.ssafy.dangdang.repository;


import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.dto.ResumeDto;
import com.ssafy.dangdang.domain.projection.ResumeMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;

import java.util.List;

@EnableJpaRepositories
public interface ResumeRepository extends JpaRepository<Resume, Long> {


//    @EntityGraph(attributePaths = {"resume_question"})
    @Query("select r from Resume  r left join fetch r.resumeQuestionList where r.id = :id")
    Resume findResumeFetchJoinByResumeId(@Param("id") Long id);

    @Query("select distinct r " +
            "from Resume  r left join fetch r.resumeQuestionList" +
            " where r.user.id = :userId")
    List<Resume> findResumeListFetchJoinByUserId(@Param("userId")Long userId);

}
