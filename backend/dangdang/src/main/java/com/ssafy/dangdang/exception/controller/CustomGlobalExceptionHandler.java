package com.ssafy.dangdang.exception.controller;

import com.ssafy.dangdang.exception.BadRequestException;
import com.ssafy.dangdang.exception.ExtantUserException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.ssafy.dangdang.util.ApiUtils.ApiResult;
import static com.ssafy.dangdang.util.ApiUtils.error;

@RestControllerAdvice
@Slf4j
public class CustomGlobalExceptionHandler  {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BadRequestException.class)
    public ApiResult<?> BadRequestHandle(BadRequestException badRequestException){
        log.error("BadRequestException 발생");
        return error(badRequestException, HttpStatus.BAD_REQUEST);
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(ExtantUserException.class)
    public ApiResult<?> BadRequestHandle(ExtantUserException extantUserException){
        log.error("ExtantUserException 발생");

        return error(extantUserException, HttpStatus.BAD_REQUEST);
    }




}
