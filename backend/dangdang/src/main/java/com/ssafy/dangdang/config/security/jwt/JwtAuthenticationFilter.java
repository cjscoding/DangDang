package com.ssafy.dangdang.config.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.LoginRequest;
import com.ssafy.dangdang.util.JwtUtil;
import com.ssafy.dangdang.util.RedisUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Slf4j
public class JwtAuthenticationFilter extends AbstractAuthenticationProcessingFilter {


	private final JwtUtil jwtUtil;
	private final RedisUtil redisUtil;
	public JwtAuthenticationFilter(JwtUtil jwtUtil, RedisUtil redisUtil){
		super(new AntPathRequestMatcher("/user/login"));
		this.jwtUtil = jwtUtil;
		this.redisUtil =redisUtil;
	}

	// Authentication 객체 만들어서 리턴 => 의존 : AuthenticationManager
	// 인증 요청시에 실행되는 함수 => /login
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		
		log.info("JwtAuthenticationFilter : 진입");
	//	if(!containsAuthorizationToken(request)) throw new IllegalStateException("Authentication is not contained");

		// request에 있는 username과 password를 파싱해서 자바 Object로 받기
		ObjectMapper om = new ObjectMapper();
		LoginRequest loginRequest = null;
		try {
			loginRequest = om.readValue(request.getInputStream(), LoginRequest.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		log.info("JwtAuthenticationFilter : "+loginRequest);


			// 유저네임패스워드 토큰 생성
		JwtAuthenticationToken authenticationToken =
					new JwtAuthenticationToken(
							loginRequest.getUsername(),
							loginRequest.getPassword()
							);
			log.info("JwtAuthenticationFilter : 토큰생성완료");

			// authenticate() 함수가 호출 되면 인증 프로바이더가 유저 디테일 서비스의
			// loadUserByUsername(토큰의 첫번째 파라메터) 를 호출하고
			// UserDetails를 리턴받아서 토큰의 두번째 파라메터(credential)과
			// UserDetails(DB값)의 getPassword()함수로 비교해서 동일하면
			// Authentication 객체를 만들어서 필터체인으로 리턴해준다.

			// Tip: 인증 프로바이더의 디폴트 서비스는 UserDetailsService 타입
			// Tip: 인증 프로바이더의 디폴트 암호화 방식은 BCryptPasswordEncoder
			// 결론은 인증 프로바이더에게 알려줄 필요가 없음.
			return getAuthenticationManager().authenticate(authenticationToken );



		

	}

	// JWT Token 생성해서 response에 담아주기
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		
		PrincipalDetails principalDetailis = new PrincipalDetails((User) authResult.getPrincipal());
		log.info("Login 성공 {}", principalDetailis.getUsername());

		String jwtToken = jwtUtil.generateToken(principalDetailis.getUsername());

		String refreshJwtToken = jwtUtil.generateRefreshToken(principalDetailis.getUsername());
		redisUtil.setDataExpire(refreshJwtToken, principalDetailis.getUsername(), JwtUtil.REFRESH_EXPIRATION_TIME);
		log.debug(JwtUtil.HEADER_STRING +jwtToken);
		log.debug(JwtUtil.REFRESH_HEADER_STRING + refreshJwtToken);

		response.addHeader(JwtUtil.HEADER_STRING, JwtUtil.TOKEN_PREFIX+jwtToken);
		response.addHeader(JwtUtil.REFRESH_HEADER_STRING, JwtUtil.REFRESH_TOKEN_PREFIX+refreshJwtToken);
		///chain.doFilter(request, response);
	}

//	private Boolean containsAuthorizationToken(HttpServletRequest request) {
//		String token = request.getHeader(HEADER_STRING);
//		if (token != null) {
//			return true;
//		}
//		return false;
//	}
//
}
