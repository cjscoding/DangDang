package com.ssafy.dangdang.config;

import com.ssafy.dangdang.config.security.CustomAccessDeniedHandler;
import com.ssafy.dangdang.config.security.CustomAuthenticationEntryPoint;
import com.ssafy.dangdang.config.security.auth.PrincipalDetailsService;
import com.ssafy.dangdang.config.security.jwt.JwtAuthenticationFilter;
import com.ssafy.dangdang.config.security.jwt.JwtAuthenticationProvider;
import com.ssafy.dangdang.config.security.jwt.JwtAuthorizationFilter;
import com.ssafy.dangdang.repository.SaltRepository;
import com.ssafy.dangdang.repository.UserRepository;
import com.ssafy.dangdang.util.JwtUtil;
import com.ssafy.dangdang.util.RedisUtil;
import com.ssafy.dangdang.util.SaltUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserRepository userRepository;

    private final PrincipalDetailsService principalDetailsService;
    private final SaltRepository saltRepository;
    private final SaltUtil saltUtil;
    private final JwtUtil jwtUtil;
    private final RedisUtil redisUtil;

    //자원 접근이 거부되었을 경우
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    //인증이 실패했을 경우
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)

                .and()
                .httpBasic().disable()
                .formLogin().disable()
                .addFilter(jwtAuthorizationFilter())

                .exceptionHandling().accessDeniedHandler(customAccessDeniedHandler)
                .authenticationEntryPoint(customAuthenticationEntryPoint)
                .and()
                .authorizeRequests()
//                .antMatchers("/**").permitAll()//테스트용으로 모든 권한 열기
                .antMatchers("/user/login").permitAll()
                .anyRequest().authenticated()
                .and()

        ;

        http .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }


    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

//    @Autowired
//    public void configureAuthentication(AuthenticationManagerBuilder builder, JwtAuthenticationProvider authenticationProvider) {
//        builder.authenticationProvider(authenticationProvider);
//    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception{
        auth.authenticationProvider(jwtAuthenticationProvider());
    }

    @Bean
    public JwtAuthenticationProvider jwtAuthenticationProvider() {
        return new JwtAuthenticationProvider(principalDetailsService,saltRepository, saltUtil);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() throws Exception {
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtUtil, redisUtil);
        jwtAuthenticationFilter.setAuthenticationManager(authenticationManagerBean());
        return jwtAuthenticationFilter;
    }

    @Bean
    public JwtAuthorizationFilter jwtAuthorizationFilter() throws Exception {
        return new JwtAuthorizationFilter(authenticationManager(), principalDetailsService, jwtUtil, redisUtil);
    }
}
