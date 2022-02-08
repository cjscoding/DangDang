package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Comment;
import com.ssafy.dangdang.domain.types.CommentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends MongoRepository<Comment, Long>, CommentRepositorySupport {


    public Page<Comment> findByReferenceIdAndDepthAndCommentType(Long referenceId, Integer depth, CommentType commentType, Pageable pageable);

    public List<Comment> findAllByReferenceIdAndDepthAndCommentType(Long referenceId, Integer depth, CommentType commentType);

    public List<Comment> findCommentByWriterEmail(String writerEmail);

    public Optional<Comment> findCommentById(String id);


}
