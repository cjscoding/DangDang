package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.types.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Optional;

@EnableJpaRepositories
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findUserByEmail(Email email);

    boolean existsByEmail(Email email);

    long countUserByEmail(Email email);

}
