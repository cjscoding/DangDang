package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.types.UserRoleType;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    @NotBlank
    @Email
    private String email;
    @NotBlank
    @NotNull
    private String nickName;

    @NonNull
    @NotBlank
    @Length(min=8, max=50)
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



    public static UserDto of(User user) {
        return UserDto.builder()
                .email(user.getEmail().toString())
                .nickName(user.getNickname())
                .password(user.getPassword())
                .role(user.getRole())
                .build();

    }



    public String getUsername() {
        return this.email.toString();
    }


    public void setUsername(String refreshUname) {
        this.email =refreshUname;
    }
}
