package com.ssafy.dangdang.repository;


import com.ssafy.dangdang.domain.Enter;
import com.ssafy.dangdang.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.List;

@EnableJpaRepositories
public interface EnterRepository extends JpaRepository<Enter, Long> {


    List<Enter> findEntersByUser(User user);
}