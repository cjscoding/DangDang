package com.ssafy.dangdang.exception.controller;

import com.ssafy.dangdang.exception.BadRequestException;
import com.ssafy.dangdang.exception.ExceedFixedNumber;
import com.ssafy.dangdang.exception.ExtantUserException;
import com.ssafy.dangdang.exception.Swagger.ApiError400;
import com.ssafy.dangdang.exception.Swagger.ApiError403;
import com.ssafy.dangdang.exception.Swagger.ApiError404;
import com.ssafy.dangdang.exception.Swagger.ApiError500;
import com.ssafy.dangdang.exception.UnauthorizedAccessException;
import com.ssafy.dangdang.exception.mattermost.NotificationManager;
import com.ssafy.dangdang.util.ApiUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.Enumeration;

import static com.ssafy.dangdang.util.ApiUtils.ApiResult;
import static com.ssafy.dangdang.util.ApiUtils.error;

@RestControllerAdvice
@Slf4j
public class CustomGlobalExceptionHandler  {

    @Autowired
    private NotificationManager notificationManager;

    @ApiResponses( value = {
            @ApiResponse(responseCode = "400", description = "잘못된 파라미터 요청", content = @Content(schema = @Schema(implementation = ApiError400.class))),
    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BadRequestException.class)
    public ApiResult<?> BadRequestHandle(BadRequestException e, HttpServletRequest req){
        log.error("BadRequestException 발생");
        e.printStackTrace();
        notificationManager.sendNotification(e, req.getRequestURI(), getParams(req));
        return error(e, HttpStatus.BAD_REQUEST);
    }

   @ApiResponses( value = {
            @ApiResponse(responseCode = "500", description = "서버 API 에러", content = @Content(schema = @Schema(implementation = ApiError500.class))),
    })
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(ExtantUserException.class)
    public ApiResult<?> BadRequestHandle(ExtantUserException e, HttpServletRequest req){
        log.error("ExtantUserException 발생");
        e.printStackTrace();
        notificationManager.sendNotification(e, req.getRequestURI(), getParams(req));
        return error(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ApiResponses( value = {
            @ApiResponse(responseCode = "404", description = "없는 리소스 요청입니다.", content = @Content(schema = @Schema(implementation = ApiError404.class))),
    })
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NullPointerException.class)
    public ApiResult<?> NullPointerHandle(NullPointerException e, HttpServletRequest req){

        log.error("NullPointerException 발생");
        e.printStackTrace();
        notificationManager.sendNotification(e, req.getRequestURI(), getParams(req));
        return error("NullPointer 참조", HttpStatus.NOT_FOUND);
    }

    @ApiResponses( value = {
            @ApiResponse(responseCode = "403", description = "권한이 없는 사용자의 요청입니다.", content = @Content(schema = @Schema(implementation = ApiError403.class))),
    })
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(UnauthorizedAccessException.class)
    public ApiResult<?> UnauthorizedAccessHandle(UnauthorizedAccessException e, HttpServletRequest req){

        log.error("권한 없는 사용자 요청");
        e.printStackTrace();
        notificationManager.sendNotification(e, req.getRequestURI(), getParams(req));
        return error("권한 없는 사용자 요청", HttpStatus.FORBIDDEN);
    }

    @ApiResponses( value = {
            @ApiResponse(responseCode = "500", description = "엔티티 중복 및 외래키 에러", content = @Content(schema = @Schema(implementation = ApiError500.class))),
    })
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ApiResult<?> UnauthorizedAccessHandle(SQLIntegrityConstraintViolationException e, HttpServletRequest req){

        log.error("엔티티 중복 저장");
        e.printStackTrace();
        notificationManager.sendNotification(e, req.getRequestURI(), getParams(req));
        return error("중복된 엔티티거나 외래키 제약이 있습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ApiResponses( value = {
            @ApiResponse(responseCode = "500", description = "정원 초과 에러", content = @Content(schema = @Schema(implementation = ApiError500.class))),
    })
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(ExceedFixedNumber.class)
    public ApiResult<?> ExceedFixedNumberHandle(ExceedFixedNumber e, HttpServletRequest req){

        log.error("정원 초과");
        e.printStackTrace();
        notificationManager.sendNotification(e, req.getRequestURI(), getParams(req));
        return error("이미 정원이 초과된 스터디입니다.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ApiResponses( value = {
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content(schema = @Schema(implementation = ApiError400.class))),
    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IOException.class)
    public ApiResult<?> BadRequestHandle(IOException e, HttpServletRequest req){
        log.error("IOException 발생");
        e.printStackTrace();
        notificationManager.sendNotification(e, req.getRequestURI(), getParams(req));
        return error(e, HttpStatus.BAD_REQUEST);
    }

    private String getParams(HttpServletRequest req) {
        StringBuilder params = new StringBuilder();
        Enumeration<String> keys = req.getParameterNames();
        while (keys.hasMoreElements()) {
            String key = keys.nextElement();
            params.append("- ").append(key).append(" : ").append(req.getParameter(key)).append("/n");
        }

        return params.toString();
    }

}
