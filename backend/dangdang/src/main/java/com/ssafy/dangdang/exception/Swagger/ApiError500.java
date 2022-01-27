package com.ssafy.dangdang.exception.Swagger;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiError500{
    @Schema(description = "API 호출 성공 유무", defaultValue = "false")
    private final boolean success = false;
    @Schema(description = "응답 데이터", defaultValue = "null")
    private final Object response = null;
    @Schema(description = "에러 정보")
    private final SwaggerApiError error = null ;

    @Getter
    static class SwaggerApiError{
        @Schema(defaultValue = "서버 API 에러 발생")
        private String message = null;
        @Schema(defaultValue = "500")
        private HttpStatus httpStatus = null;
    }
}