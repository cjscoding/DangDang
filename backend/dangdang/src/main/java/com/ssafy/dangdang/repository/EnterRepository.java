package com.ssafy.dangdang.repository;


import com.ssafy.dangdang.domain.Enter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface EnterRepository extends JpaRepository<Enter, Long> {
}
