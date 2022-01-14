package com.ssafy.bori.domain;

import com.ssafy.bori.domain.types.Email;
import com.ssafy.bori.domain.types.UserRoleType;
import com.ssafy.bori.domain.types.converter.EmailAttrConverter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Collections;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nickname;

    @Enumerated(EnumType.STRING)
    private UserRoleType role;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", nickname='" + nickname + '\'' +
                ", role=" + role +
                ", email=" + email +
                ", password='" + password + '\'' +
                ", salt=" + salt +
                '}';
    }

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
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }



    @Override
    public String getUsername() {
        return this.email.toString();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
