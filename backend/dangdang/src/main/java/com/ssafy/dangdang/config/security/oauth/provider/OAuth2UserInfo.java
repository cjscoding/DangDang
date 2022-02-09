package com.ssafy.dangdang.config.security.oauth.provider;

public interface OAuth2UserInfo {
    String getProviderId();
    String getProvider();
    String getEmail();
    String getName();
    String getImageUrl();
}
