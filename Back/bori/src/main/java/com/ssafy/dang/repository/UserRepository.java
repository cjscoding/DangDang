package com.ssafy.bori.repository;

import com.ssafy.bori.domain.User;
import com.ssafy.bori.domain.dto.UserDto;
import com.ssafy.bori.domain.types.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Optional;

@EnableJpaRepositories
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findUserByEmail(Email email);


    int countUserByEmail(Email email);

}
