package com.ssafy.dangdang.config.security.oauth;

import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.exception.BadRequestException;
import com.ssafy.dangdang.util.CookieUtils;
import com.ssafy.dangdang.util.JwtUtil;
import com.ssafy.dangdang.util.RedisUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.ssafy.dangdang.config.security.oauth.HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;

@RequiredArgsConstructor
@Component
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    public static final String REDIRECT_URI = "redirect_uri";
    private final JwtUtil jwtUtil;
    private final RedisUtil redisUtil;
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2AuthenticationSuccessHandler"+"접근");
        String goalUrl = determinegoalUrl(request, response, authentication);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + goalUrl);
            return;
        }


        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, goalUrl);
    }

    protected String determinegoalUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        Optional<String> redirectUri = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);

        if(redirectUri.isPresent()&& !isAuthorizedRedirectUri(redirectUri.get())) {
            throw new BadRequestException("Sorry! We've got an Unauthorized Redirect URI and can't proceed with the authentication");
        }

        String targetUrl = redirectUri.orElse(getDefaultTargetUrl());

        //String token = tokenProvider.createToken(authentication);
        System.out.println(authentication.getPrincipal());
        PrincipalDetails principalDetailis = (PrincipalDetails) authentication.getPrincipal();

        String jwtToken = jwtUtil.generateToken(principalDetailis.getUsername());

        String refreshJwtToken = jwtUtil.generateRefreshToken(principalDetailis.getUsername());
        redisUtil.setDataExpire(refreshJwtToken, principalDetailis.getUsername(), JwtUtil.REFRESH_EXPIRATION_TIME);

        response.addHeader(JwtUtil.HEADER_STRING, JwtUtil.TOKEN_PREFIX+jwtToken);
        response.addHeader(JwtUtil.REFRESH_HEADER_STRING, JwtUtil.REFRESH_TOKEN_PREFIX+refreshJwtToken);

        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("token", jwtToken)
                .queryParam("refreshToken", refreshJwtToken)
                .build().toUriString();
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }

    private boolean isAuthorizedRedirectUri(String uri) {
        URI clientRedirectUri = URI.create(uri);
        List<String> redirects =  new ArrayList<>();
        redirects.add("http://localhost:3000/oauth2/redirect");
        redirects.add("myandroidapp://oauth2/redirect");
        redirects.add("myiosapp://oauth2/redirect");

        return redirects
                .stream()
                .anyMatch(authorizedRedirectUri -> {
                    // Only validate host and port. Let the clients use different paths if they want to
                    URI authorizedURI = URI.create(authorizedRedirectUri);
                    if(authorizedURI.getHost().equalsIgnoreCase(clientRedirectUri.getHost())
                            && authorizedURI.getPort() == clientRedirectUri.getPort()) {
                        return true;
                    }
                    return false;
                });
    }



}
