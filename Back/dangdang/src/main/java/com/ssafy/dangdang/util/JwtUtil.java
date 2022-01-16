package com.ssafy.dangdang.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

//    public final static long TOKEN_VALIDATION_SECOND = 1000L * 10;
//    public final static long REFRESH_TOKEN_VALIDATION_SECOND = 1000L * 60 * 24 * 2;
//    final static public String ACCESS_TOKEN_NAME = "accessToken";
//    final static public String REFRESH_TOKEN_NAME = "refreshToken";
//    @Value("${spring.jwt.secret}")
//    private String SECRET_KEY;

    private final static String SECRET_KEY = "eae6d34010d4fea74bcafeeef81c1f8685e4793dfe98701d30e568118b31e4e0"; // 우리 서버만 알고 있는 비밀값
    private final static long ACCESS_EXPIRATION_TIME = 1800; // 30분
    public final static long REFRESH_EXPIRATION_TIME = 864000000; // 10일
    public final static String TOKEN_PREFIX = "Bearer ";
    public final static String REFRESH_TOKEN_PREFIX = "Refresh Bearer ";
    public final static String HEADER_STRING = "Authorization";
    public final static String REFRESH_HEADER_STRING = "refreshtoken";


    private Key getSigningKey(String secretKey) {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Claims extractAllClaims(String token) throws ExpiredJwtException {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey(SECRET_KEY))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getUsername(String token) {
        return extractAllClaims(token).get("username", String.class);
    }

    public Boolean isTokenExpired(String token) {
        final Date expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    public String generateToken(String username) {
        return doGenerateToken(username, ACCESS_EXPIRATION_TIME);
    }

    public String generateRefreshToken(String username) {
        return doGenerateToken(username, REFRESH_EXPIRATION_TIME);
    }

    public String doGenerateToken(String username, long expireTime) {

        Claims claims = Jwts.claims();
        claims.put("username", username);

        String jwt = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expireTime))
                .signWith(getSigningKey(SECRET_KEY), SignatureAlgorithm.HS256)
                .compact();

        return jwt;
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsername(token);

        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

}
