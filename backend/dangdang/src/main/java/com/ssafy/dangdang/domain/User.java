package com.ssafy.dangdang.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.domain.types.UserRoleType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30)
    private String nickname;

    @Enumerated(EnumType.STRING)
    private UserRoleType role;

    @Column(unique = true, length = 50, nullable = false)
    @Email
    @NotNull
    private String email;

    //@NotBlank OAuth의 경우에는 비밀번호가 필요없음
    @JsonIgnore
    private String password;

    private String imageUrl;


    //OAuth용
    private String provider;
    private String providerId;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    @Builder.Default
    private List<Joins> joins = new ArrayList<>();

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "writer", cascade = CascadeType.ALL)
    private List<Post> posts = new ArrayList<>();

//    @OneToMany(mappedBy = "host")
//    private List<Study> studies = new ArrayList<>();

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

    public static User of(UserDto userDto){
        return User.builder()
                .email(userDto.getEmail())
                .nickname(userDto.getNickName())
                .role(userDto.getRole())
                .build();

    }

    public String getUsername() {
        return this.email.toString();
    }

    public void raiseToManager(){
        this.role = UserRoleType.MANAGER;
    }

    public void raiseToAdmin(){
        this.role = UserRoleType.ADMIN;
    }

    public void addImageUrl(String path){ this.imageUrl = path;}
}
