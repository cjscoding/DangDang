package com.ssafy.dangdang.exception;

public class ExceedFixedNumber extends RuntimeException {
    public ExceedFixedNumber(String message) {
        super(message);
    }

    public ExceedFixedNumber(String message, Throwable cause) {
        super(message, cause);
    }
}