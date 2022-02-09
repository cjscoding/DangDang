package com.ssafy.dangdang.domain.types;

import lombok.Getter;

@Getter
public enum UserRoleType {
    USER("ROLE_USER"),
    MANAGER("ROLE_MANAGER"),
    ADMIN("ROLE_ADMIN");

    private final String name;


    UserRoleType(String name) {
        this.name = name;
    }

    public static class ROLES {

        public static final String USER = "ROLE_USER";
        public static final String MANAGER = "ROLE_MANAGER";
        public static final String ADMIN = "ROLE_ADMIN";

    }
}

