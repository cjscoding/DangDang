package com.ssafy.bori.domain.types;

import lombok.Getter;

import java.io.Serializable;

@Getter
public enum UserRoleType {
    USER("일반", 100),
    ADMIN("관리자", 200);

    private final String name;

    private final int code;

    UserRoleType(String name, int code) {
        this.name = name;
        this.code = code;
    }

    public static class ROLES {

        public static final String USER = "ROLE_USER";

        public static final String ADMIN = "ROLE_ADMIN";

    }
}