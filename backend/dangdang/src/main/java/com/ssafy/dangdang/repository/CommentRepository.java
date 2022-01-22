package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CommentRepository extends MongoRepository<Comment, Long> {


    public Page<Comment> findByPostIdAndDepth(Long postId, Integer depth, Pageable pageable);

    public Optional<Comment> findCommentById(String id);


}
