package com.ssafy.dangdang.config.security.jwt;

import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.config.security.auth.PrincipalDetailsService;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;

public class JwtAuthenticationProvider  implements AuthenticationProvider {


    private final PrincipalDetailsService principalDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public JwtAuthenticationProvider(PrincipalDetailsService principalDetailsService) {
        this.principalDetailsService = principalDetailsService;
    }

    @SneakyThrows
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        System.out.println("JwtAuthenticationProvider 호출:"+ authentication.getPrincipal());
        System.out.println("JwtAuthenticationProvider 호출:"+ authentication.getCredentials());
        System.out.println("JwtAuthenticationProvider 호출:"+ authentication.getName());
        PrincipalDetails userDetails = principalDetailsService.loadUserByUsername(authentication.getPrincipal().toString());


        if(!passwordEncoder.matches(authentication.getCredentials().toString(), userDetails.getPassword()))
            throw new BadCredentialsException("비밀번호가 틀립니다.");

        return new JwtAuthenticationToken(userDetails.getUser(),null,userDetails.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(JwtAuthenticationToken.class);
    }
}
