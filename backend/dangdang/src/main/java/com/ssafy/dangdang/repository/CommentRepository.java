package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Comment;
import com.ssafy.dangdang.domain.types.CommentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CommentRepository extends MongoRepository<Comment, Long> {


    public Page<Comment> findByReferenceIdAndDepthAndCommentType(Long referenceId, Integer depth, CommentType commentType, Pageable pageable);

    public Optional<Comment> findCommentById(String id);


}
