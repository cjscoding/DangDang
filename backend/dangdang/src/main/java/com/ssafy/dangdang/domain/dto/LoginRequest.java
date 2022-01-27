package com.ssafy.dangdang.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Schema(description = "로그인 요청")
@Getter
@Setter
public class LoginRequest {
    @Schema(description = "유저 Email", nullable = false, example = "test@ssafy.com")
    String email;
    @Schema(description = "유저 Password", nullable = false, example = "test@ssafy.com")
    String password;

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public LoginRequest() {

    }

    @Schema( hidden = true)
    public String getUsername(){
        return this.email;
    }

}
