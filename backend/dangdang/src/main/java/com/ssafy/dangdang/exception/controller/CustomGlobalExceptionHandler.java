package com.ssafy.dangdang.exception.controller;

import com.ssafy.dangdang.exception.BadRequestException;
import com.ssafy.dangdang.exception.ExtantUserException;
import com.ssafy.dangdang.exception.mattermost.NotificationManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;

import java.util.Enumeration;

import static com.ssafy.dangdang.util.ApiUtils.ApiResult;
import static com.ssafy.dangdang.util.ApiUtils.error;

@RestControllerAdvice
@Slf4j
public class CustomGlobalExceptionHandler  {

    @Autowired
    private NotificationManager notificationManager;

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BadRequestException.class)
    public ApiResult<?> BadRequestHandle(BadRequestException e, HttpServletRequest req){
        log.error("BadRequestException 발생");
        e.printStackTrace();
        notificationManager.sendNotification(e, req.getRequestURI(), getParams(req));
        return error(e, HttpStatus.BAD_REQUEST);
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(ExtantUserException.class)
    public ApiResult<?> BadRequestHandle(ExtantUserException e, HttpServletRequest req){
        log.error("ExtantUserException 발생");
        e.printStackTrace();
        notificationManager.sendNotification(e, req.getRequestURI(), getParams(req));
        return error(e, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(NullPointerException.class)
    public ApiResult<?> NullPointerHandle(NullPointerException e, HttpServletRequest req){

        log.error("NullPointerException 발생");
        e.printStackTrace();
        notificationManager.sendNotification(e, req.getRequestURI(), getParams(req));
        return error("NullPointer 참조", HttpStatus.NOT_FOUND);
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
