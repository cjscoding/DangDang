package com.ssafy.dangdang.domain.types;

import lombok.Getter;

@Getter
public enum UserRoleType {
    USER("일반"),
    ADMIN("관리자");

    private final String name;


    UserRoleType(String name) {
        this.name = name;
    }

    public static class ROLES {

        public static final String USER = "ROLE_USER";

        public static final String ADMIN = "ROLE_ADMIN";

    }
}

