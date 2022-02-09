package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.domain.dto.VoiceText;
import com.ssafy.dangdang.util.ApiUtils;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import javax.servlet.http.HttpServletResponse;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.*;

import java.nio.charset.StandardCharsets;
import java.util.*;
import static com.ssafy.dangdang.util.ApiUtils.*;
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ApiController {

    static final String KAKAO_TTS = "https://kakaoi-newtone-openapi.kakao.com/v1/synthesize";

    @Operation(summary = "카카오 TTS 호출")
    @PostMapping(value = "/tts")
    public byte[] callTTS(@RequestBody VoiceText voiceText, HttpServletResponse response) throws ParserConfigurationException, TransformerException {
        String text = voiceText.getText();
        log.info("text : {}", text);
        RestTemplate rt = new RestTemplate();

        // Header 및 Body 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK c420902bf013e6a215efef159a46af41");
        headers.setContentType(MediaType.APPLICATION_XML);
        log.info("text : {}", text);
        String value = "<speak><voice name=\"MAN_READ_CALM\">" + text + "</voice></speak>";
        log.info(value);
        value = new String(value.getBytes(), StandardCharsets.ISO_8859_1);
        log.info(value);
        // 설정한 Header와 Body를 가진 HttpEntity 객체 생성
        HttpEntity<String> entity = new HttpEntity<>(value,  headers);
        ResponseEntity<String> res = rt.exchange(KAKAO_TTS, HttpMethod.POST, entity, String.class);

        log.info("status : ");
        log.info("status : " + res.getStatusCode());
        log.info("status : " + res.getHeaders());
        for ( String key:
             res.getHeaders().keySet()) {
            response.setHeader(key, String.valueOf(res.getHeaders().get(key)));
        }

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

        byte [] bytes = res.getBody().getBytes(StandardCharsets.UTF_8);

        return bytes;
    }

}
