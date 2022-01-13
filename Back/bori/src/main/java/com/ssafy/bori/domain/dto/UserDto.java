package com.ssafy.bori.domain.dto;

import com.ssafy.bori.domain.User;
import com.ssafy.bori.domain.types.Email;
import com.ssafy.bori.domain.types.UserRoleType;
import lombok.Builder;
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
