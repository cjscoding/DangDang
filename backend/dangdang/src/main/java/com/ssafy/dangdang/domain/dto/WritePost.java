package com.ssafy.dangdang.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Schema(description = "게시글 작성")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WritePost {


    @Schema(description = "게시글 제목", example = "맛있는 민초에 대한 고찰")
    private String title;
    @Schema(description = "게시글 내용", example = "초콜릿을 박하와 섞어 먹는 형태는 초콜릿이 카카오의 형태로 처음 유럽에 들어온 16세기부터 생겼다. 다만 이 때는 카카오를 약으로 썼기에 너무 써서 먹기 불편한 카카오를 조금이라도 편하게 먹기 위해 박하와 섞었다.[1] 이후 설탕이 섞인 초콜릿이 등장한 이후로도, 유럽에선 초콜릿과 민트를 같이 먹기를 즐겼다. 18세기 무렵부터 시중의 카페에선 초콜릿과 민트를 섞은 음료를 팔았다. 참고 자료. 아이스크림 역시 마찬가지로 이미 1945년 배스킨라빈스가 처음 가게를 열었을 때부터 메뉴에 민트초코 아이스크림이 존재했다. # 참고 사이트(영문) 그 외에도 20세기 초반에는 북미를 중심으로 박하와 초콜릿을 섞은 디저트류가 많은 곳에서 팔렸다.")
    private String content;

}
