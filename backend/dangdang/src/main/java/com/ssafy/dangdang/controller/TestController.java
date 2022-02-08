package com.ssafy.dangdang.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@Controller
@Slf4j
public class TestController {
    @RequestMapping("/test")
    public String chat2(){
        return "groupcallAndChat.html";
    }
}
