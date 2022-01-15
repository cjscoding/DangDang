package com.ssafy.dangdang.config.security.jwt;

import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.config.security.auth.PrincipalDetailsService;
import com.ssafy.dangdang.domain.Salt;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.types.Email;
import com.ssafy.dangdang.repository.SaltRepository;
import com.ssafy.dangdang.util.SaltUtil;
import lombok.SneakyThrows;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.EntityNotFoundException;

public class JwtAuthenticationProvider  implements AuthenticationProvider {

    private final PrincipalDetailsService principalDetailsService;
    private final SaltRepository saltRepository;

    private final SaltUtil saltUtil;

    public JwtAuthenticationProvider(PrincipalDetailsService principalDetailsService, SaltRepository saltRepository, SaltUtil saltUtil) {
        this.principalDetailsService = principalDetailsService;
        this.saltRepository = saltRepository;
        this.saltUtil= saltUtil;
    }

    @SneakyThrows
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        System.out.println("JwtAuthenticationProvider 호출:"+ authentication.getPrincipal());
        System.out.println("JwtAuthenticationProvider 호출:"+ authentication.getCredentials());
        System.out.println("JwtAuthenticationProvider 호출:"+ authentication.getName());
        PrincipalDetails userDetails = principalDetailsService.loadUserByUsername(authentication.getPrincipal().toString());

        Salt salt = saltRepository.findSaltById( userDetails.getUser().getSalt().getId());
        String password = saltUtil.encodePassword(salt.getSalt(),authentication.getCredentials().toString());



        if(!userDetails.getPassword().equals(password))
            throw new BadCredentialsException("비밀번호가 틀립니다.");

        return new JwtAuthenticationToken(userDetails.getUser(),null,userDetails.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(JwtAuthenticationToken.class);
    }
}
