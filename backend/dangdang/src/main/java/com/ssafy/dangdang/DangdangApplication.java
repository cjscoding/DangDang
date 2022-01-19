package com.ssafy.dangdang;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@EnableWebMvc
@SpringBootApplication
public class DangdangApplication {

    public static void main(String[] args) {
        SpringApplication.run(DangdangApplication.class, args);
    }

}