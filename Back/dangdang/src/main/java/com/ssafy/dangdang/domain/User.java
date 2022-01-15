package com.ssafy.dangdang.domain;

import com.ssafy.dangdang.domain.types.Email;
import com.ssafy.dangdang.domain.types.UserRoleType;
import com.ssafy.dangdang.domain.types.converter.EmailAttrConverter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nickname;

    @Enumerated(EnumType.STRING)
    private UserRoleType role;

    @Column(unique = true)
    @Convert(converter = EmailAttrConverter.class, attributeName = "email")
    @NotNull
    private Email email;

    @NotBlank
    private String password;

    @OneToOne
    @JoinColumn(name = "salt_id")
    @NotNull
    private Salt salt;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", nickname='" + nickname + '\'' +
                ", role=" + role +
                ", email=" + email +
                ", password='" + password + '\'' +
                '}';
    }

    public String getUsername() {
        return this.email.toString();
    }
}
