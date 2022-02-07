package com.ssafy.dangdang.controller;

import io.netty.handler.codec.http.HttpUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ApiController {

    static final String KAKAO_TTS = "https://kakaoi-newtone-openapi.kakao.com/v1/synthesize";

    @Operation(summary = "카카오 TTS 호출")
    @GetMapping(value = "/tts")
    public ResponseEntity<String> callTTS(HttpServletResponse response, @RequestParam  String text) throws ParserConfigurationException, TransformerException {

        RestTemplate rt = new RestTemplate();

        // Header 및 Body 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK c420902bf013e6a215efef159a46af41");
        headers.setContentType(MediaType.APPLICATION_XML);
//        MultiValueMap<String, String> body = new HashMap<String, String>();
        String value = "<speak><voice name=\"MAN_READ_CALM\">" + text + "</voice></speak>";

        // 설정한 Header와 Body를 가진 HttpEntity 객체 생성
        HttpEntity<String> entity = new HttpEntity<>(value,  headers);
        ResponseEntity<String> res = rt.exchange(KAKAO_TTS, HttpMethod.POST, entity, String.class);

        log.info("status : ");
        log.info("status : " + res.getStatusCode());
        log.info("body : " + res.getBody());

//        return ResponseEntity.ok()
//                //.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
//                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
//                .header(HttpHeaders.CONTENT_TYPE, "audio/mpeg")
//                .body(res);
        return res;
    }

}
