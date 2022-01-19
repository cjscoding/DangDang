package com.ssafy.dangdang.domain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    String email;
    String password;

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public LoginRequest() {

    }

    public String getUsername(){
        return this.email;
    }

}
