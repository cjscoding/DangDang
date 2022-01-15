package com.ssafy.bori.repository;

import com.ssafy.bori.domain.Salt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface SaltRepository extends JpaRepository<Salt, Long> {

    Salt findSaltById(Long id);
}
