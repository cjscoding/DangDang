package com.ssafy.dangdang.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Study {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDateTime created_at;

    private int number;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host", insertable = false, updatable = false)
    private User host;

    @OneToMany(mappedBy = "study")
    private List<Enter> enters = new ArrayList<>();

}
