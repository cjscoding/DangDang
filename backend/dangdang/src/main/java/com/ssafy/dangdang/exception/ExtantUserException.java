package com.ssafy.dangdang.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
@Getter
public class ExtantUserException extends RuntimeException {


    public ExtantUserException(String message) {
        super(message);
    }
    public ExtantUserException(String message, Throwable cause) {
        super(message, cause);
    }




}

