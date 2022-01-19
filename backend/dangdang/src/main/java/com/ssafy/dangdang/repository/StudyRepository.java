package com.ssafy.dangdang.repository;

import com.ssafy.dangdang.domain.Study;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface StudyRepository extends JpaRepository<Study, Long>, StudyRepositorySupport {


}
