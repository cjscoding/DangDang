package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.types.UserRoleType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {

    private String email;
    private String nickName;
    private String password;
    private UserRoleType role;


    @Override
    public String toString() {
        return "UserDto{" +
                "email=" + email +
                ", nickName='" + nickName + '\'' +
                ", password='" + password + '\'' +
                ", role=" + role +
                '}';
    }

    public UserDto() {
    }

    public UserDto(User user) {
        this.email = user.getEmail().toString();
        this.nickName = user.getNickname();
        this.password = user.getPassword();
        this.role = user.getRole();
    }



    public String getUsername() {
        return this.email.toString();
    }


    public void setUsername(String refreshUname) {
        this.email =refreshUname;
    }
}
