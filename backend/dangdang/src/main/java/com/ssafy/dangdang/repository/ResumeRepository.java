package com.ssafy.dangdang.repository;


import com.ssafy.dangdang.domain.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
}
