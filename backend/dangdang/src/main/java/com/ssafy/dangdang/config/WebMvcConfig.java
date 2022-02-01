//package com.ssafy.dangdang.config;
//
//import com.ssafy.dangdang.util.JwtUtil;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.EnableWebMvc;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebMvcConfig implements WebMvcConfigurer {
//
//    private final long MAX_AGE_SECS = 3800;
//
//
//    private String[] allowedOrigins =new String[] {"http://localhost:3000"};
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:3000")
//                .allowedMethods("GET", "PUT", "POST", "DELETE", "HEAD", "OPTIONS")
////                .allowedHeaders("*")
////                .allowCredentials(true)
//                .exposedHeaders(JwtUtil.HEADER_STRING, JwtUtil.REFRESH_HEADER_STRING)
//                .maxAge(MAX_AGE_SECS);
//
//    }
//}
