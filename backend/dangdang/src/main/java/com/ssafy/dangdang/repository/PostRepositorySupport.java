package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


public interface PostRepositorySupport{

//    @Query(value = "select distinct p from Post p " +
//            "left join fetch p.writer " +
//            "left join fetch p.study " +
//            "where p.study.id = :studyId",
//            countQuery = "select distinct p from Post p " +
//                    "left join fetch p.writer " +
//                    "left join fetch p.study " +
//                    "where p.study.id = :studyId")
    public Page<Post> findPostByAllWithUser(Long studyId, Pageable pageable);

}
