package com.ssafy.dangdang.domain;

import com.ssafy.dangdang.domain.types.UserRoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
    @Column(name = "user_id")
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
    private String password;

    private String imageUrl;


    //OAuth용
    private String provider;
    private String providerId;

    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<Joins> enters = new ArrayList<>();

    @Builder.Default
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

    public String getUsername() {
        return this.email.toString();
    }
}
