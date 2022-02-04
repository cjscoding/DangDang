package com.ssafy.dangdang.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.dangdang.domain.types.UserRoleType;
import io.swagger.v3.oas.annotations.media.Schema;
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
public class SignUp {

    @Schema(description = "유저 id", nullable = false, example = "1")
    private Long id;

    @NotBlank
    @Email
    @Schema(description = "유저 Email", nullable = false, example = "bori@dangdang.com")
    private String email;
    @NotBlank
    @NotNull
    @Schema(description = "유저 닉네임", example = "bori")
    private String nickName;

    @Length(min=8, max=50)
    @Schema(description = "유저 비밀번호", example = "boribori123")
    private String password;

}
