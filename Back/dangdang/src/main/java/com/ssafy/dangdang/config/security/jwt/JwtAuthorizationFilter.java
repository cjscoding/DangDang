package com.ssafy.dangdang.config.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.config.security.auth.PrincipalDetailsService;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.types.Email;
import com.ssafy.dangdang.repository.UserRepository;
import com.ssafy.dangdang.util.JwtUtil;
import com.ssafy.dangdang.util.RedisUtil;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

// 인가
public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

	private final PrincipalDetailsService principalDetailsService;
	private final JwtUtil jwtUtil;
	private final RedisUtil redisUtil;

	public JwtAuthorizationFilter(AuthenticationManager authenticationManager, PrincipalDetailsService principalDetailsService, JwtUtil jwtUtil, RedisUtil redisUtil) {
		super(authenticationManager);
		this.principalDetailsService = principalDetailsService;
		this.jwtUtil = jwtUtil;
		this.redisUtil = redisUtil;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		String header = request.getHeader(jwtUtil.HEADER_STRING);
		System.out.println("header Authorization : " + header);
		String refreshHeader = request.getHeader(jwtUtil.REFRESH_HEADER);
		System.out.println("refreshHeader Authorization : " + refreshHeader);
		String refreshToken = null;
		String refreshUsername;
		Boolean jwtExpired = false;
		if (header == null || !header.startsWith(jwtUtil.TOKEN_PREFIX)) {
			//Refresh토큰 코드

			chain.doFilter(request, response);
			return;
		}
		try {
		String token = request.getHeader(jwtUtil.HEADER_STRING).replace(jwtUtil.TOKEN_PREFIX, "");
			//만료되었다면 ExpiredJwtException을 던진다.
		String username = jwtUtil.getUsername(token);
			// 토큰 검증 (이게 인증이기 때문에 AuthenticationManager도 필요 없음)
			if(username != null) {
				PrincipalDetails userDetails = principalDetailsService.loadUserByUsername(username);
				if (jwtUtil.validateToken(token, userDetails)) {
					// 인증은 토큰 검증시 끝. 인증을 하기 위해서가 아닌 스프링 시큐리티가 수행해주는 권한 처리를 위해
					// 아래와 같이 토큰을 만들어서 Authentication 객체를 강제로 만들고 그걸 세션에 저장!
					// 인가의 과정이기 때문에, 비밀번호 필요 없음
					UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
					usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
				}
			}
		} catch (ExpiredJwtException e){
			if(refreshHeader !=null && refreshHeader.startsWith(jwtUtil.REFRESH_TOKEN_PREFIX)){

			refreshToken = request.getHeader(jwtUtil.REFRESH_HEADER).replace(jwtUtil.REFRESH_TOKEN_PREFIX, "");
			jwtExpired = true;

		}

		}
		try {
			if(refreshToken != null && jwtExpired){
				refreshUsername = redisUtil.getData(refreshToken);
				//토큰 검증
				if(refreshUsername.equals(jwtUtil.getUsername(refreshToken))){
					//refreshToken을 이용한 검증을 통과하면 인가
					PrincipalDetails userDetails = principalDetailsService.loadUserByUsername(refreshUsername);
					// 인가의 과정이기 때문에, 비밀번호 필요 없음
					UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails,null, userDetails.getAuthorities());
					usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
					//refreshToken을 이용해서 access token 재발급
					String newJwtToken = jwtUtil.generateToken(refreshUsername);
					response.addHeader(JwtUtil.HEADER_STRING, JwtUtil.TOKEN_PREFIX+newJwtToken);
				}
			}

		}catch (ExpiredJwtException e){

		}

		chain.doFilter(request, response);
	}

}
