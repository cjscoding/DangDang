package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Comment;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import static com.ssafy.dangdang.util.ApiUtils.success;

@Repository
@RequiredArgsConstructor
public class CommentRepositorySupportImpl implements CommentRepositorySupport{

    private final MongoTemplate mongoTemplate;

    @Override
    public void recurDelete(Comment comment) {
        if(!comment.getChildren().isEmpty()){
            for (Comment child:
                    comment.getChildren()) {
                this.recurDelete(child);
            }
        }
        mongoTemplate.remove(comment);
    }
}
