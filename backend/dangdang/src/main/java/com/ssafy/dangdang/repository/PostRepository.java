package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Post;
import com.ssafy.dangdang.domain.Study;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.List;

@EnableJpaRepositories
public interface PostRepository extends JpaRepository<Post, Long>, PostRepositorySupport {



    @Query("select p from Post p " +
            "left join fetch p.writer " +
            "left join fetch p.study " +
            "where p.id = :postId" )
    public Post findPostWithUser(Long postId);

}
