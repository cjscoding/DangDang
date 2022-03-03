package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findUserByEmail(String email);

    boolean existsByEmail(String email);

    long countUserByEmail(String email);

    @Query("select u from User u " +
            "where u.id in " +
            "(select j.user.id from Joins j where j.study.id = :studyId and j.waiting = true )")
    List<User> findWaitingUsers(@Param("studyId") Long studyId);

    @Query("select count(u.id) from User u " +
            "where u.id = :userId and u.id in " +
            "(select j.user.id from Joins j " +
            "where j.study.id = :studyId and j.waiting = false )")
    Integer countUserByStudyId(@Param("userId")Long userId,@Param("studyId") Long studyId);

    @Query(value = "select u from User u where u.role <> 'ADMIN'",
    countQuery ="select count(u) from User u where u.role <> 'ADMIN'" )
    Page<User> findAllExceptAdmin(Pageable pageable);

}
