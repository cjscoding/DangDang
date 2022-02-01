package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Post;
import com.ssafy.dangdang.repository.support.Querydsl4RepositorySupport;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.ssafy.dangdang.domain.QPost;
import static com.ssafy.dangdang.domain.QPost.post;
import static com.ssafy.dangdang.domain.QStudy.study;
import static com.ssafy.dangdang.domain.QUser.user;

public class PostRepositorySupportImpl extends Querydsl4RepositorySupport implements PostRepositorySupport {

    public PostRepositorySupportImpl() {
        super(Post.class);
    }

    @Override
    public Page<Post> findPostByAllWithUser(Long studyId, @Parameter(description = "페이지 정보", required = false) Pageable pageable) {


        Page<Post> posts = applyPagination(pageable, contentQuery -> contentQuery
                        .selectFrom(post)
                        .leftJoin(post.study, study).fetchJoin()
                        .leftJoin(post.writer, user).fetchJoin()
                        .where(post.study.id.eq(studyId))

                , countQuery -> countQuery
                        .selectFrom(post)
                        .leftJoin(post.study, study).fetchJoin()
                        .leftJoin(post.writer, user).fetchJoin()
                        .where(post.study.id.eq(studyId)));
        return posts;

    }
}
