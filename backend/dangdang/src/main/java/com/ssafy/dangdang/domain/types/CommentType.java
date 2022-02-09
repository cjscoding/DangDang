package com.ssafy.dangdang.domain.types;

public enum CommentType {

    STUDY("스터디"),
    POST("게시글"),
    RESUME("자소서");

    private String name;

    CommentType(String name) {
        this.name = name;
    }
}
