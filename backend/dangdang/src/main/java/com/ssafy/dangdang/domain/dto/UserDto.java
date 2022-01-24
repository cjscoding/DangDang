package com.ssafy.dangdang.domain.dto;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.types.UserRoleType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Schema(description = "유저 정보")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    @NotBlank
    @Email
    @Schema(description = "유저 Email", nullable = false, example = "bori@dangdang.com")
    private String email;
    @NotBlank
    @NotNull
    @Schema(description = "유저 닉네임", example = "bori")
    private String nickName;

    @NonNull
    @NotBlank
    @Length(min=8, max=50)
    @Schema(description = "유저 비밀번호", example = "boribori123")
    private String password;

    @Schema( hidden = true)

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



}
