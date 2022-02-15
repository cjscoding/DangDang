package com.ssafy.dangdang.repository;


import com.ssafy.dangdang.domain.Joins;
import com.ssafy.dangdang.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
public interface JoinsRepository extends JpaRepository<Joins, Long> {

    List<Joins> findJoinsByUser(User user);

    Optional<Joins> findJoinsByUserIdAndStudyId(Long userId, Long studyId);

    List<Joins> findJoinsByStudyId(Long studyId);

}
