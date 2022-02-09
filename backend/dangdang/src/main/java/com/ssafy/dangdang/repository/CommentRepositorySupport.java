package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Comment;

public interface CommentRepositorySupport {

    void recurDelete(Comment comment);
}
