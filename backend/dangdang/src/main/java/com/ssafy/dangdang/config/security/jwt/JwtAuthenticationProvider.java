package com.ssafy.dangdang.config.security.jwt;

import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.config.security.auth.PrincipalDetailsService;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
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

        log.debug("JwtAuthenticationProvider 호출:"+ authentication.getPrincipal());
        log.debug("JwtAuthenticationProvider 호출:"+ authentication.getCredentials());
        log.debug("JwtAuthenticationProvider 호출:"+ authentication.getName());
        PrincipalDetails userDetails = principalDetailsService.loadUserByUsername(authentication.getPrincipal().toString());


        if(!passwordEncoder.matches(authentication.getCredentials().toString(), userDetails.getPassword()))
            throw new BadCredentialsException("비밀번호가 틀립니다.");
        log.debug("userAuthorities {}", userDetails.getAuthorities());
        return new JwtAuthenticationToken(userDetails.getUser(),null,userDetails.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(JwtAuthenticationToken.class);
    }
}
