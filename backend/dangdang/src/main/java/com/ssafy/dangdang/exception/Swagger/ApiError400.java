package com.ssafy.dangdang.exception.Swagger;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiError400{
    @Schema(description = "API 호출 성공 유무", defaultValue = "false")
    private final boolean success = false;
    @Schema(description = "응답 데이터", defaultValue = "null")
    private final Object response = null;
    @Schema(description = "에러 정보")
    private final SwaggerApiError error = null ;

    @Getter
    static class SwaggerApiError{
        @Schema(defaultValue = "잘못된 파라미터 요청입니다.")
        private String message = "잘못된 파라미터 요청입니다.";
        @Schema(defaultValue = "400")
        private HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
    }
}