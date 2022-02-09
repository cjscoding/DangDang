package com.ssafy.dangdang.config;

import com.ssafy.dangdang.util.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://localhost:80"); // Access-Control-Allow-Origin  (Response에 자동으로 추가해줌)
        config.addAllowedOrigin("http://i6c203.p.ssafy.io:3000");
        config.addAllowedOrigin("https://i6c203.p.ssafy.io:3000");
        config.addAllowedOrigin("https://i6c203.p.ssafy.io:80");
        config.addAllowedHeader("*");  // Access-Control-Request-Headers
        config.addAllowedMethod("*");
        config.addExposedHeader(JwtUtil.HEADER_STRING);
        config.addExposedHeader(JwtUtil.REFRESH_HEADER_STRING);

        source.registerCorsConfiguration("/**", config);
        return (source);
    }

}
