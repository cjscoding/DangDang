package com.ssafy.dangdang.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Salt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull()
    private String salt;

    @OneToOne(mappedBy = "salt")
    private User user;

    @Override
    public String toString() {
        return "Salt{" +
                "id=" + id +
                ", salt='" + salt + '\'' +
             //   ", user=" + user +
                '}';
    }
}
