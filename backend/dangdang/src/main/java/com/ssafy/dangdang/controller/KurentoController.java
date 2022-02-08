package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.kurento.HelloWorldRecHandler;
import com.ssafy.dangdang.config.kurento.UserRegistry;
import com.ssafy.dangdang.config.kurento.UserSession;
import com.ssafy.dangdang.service.StorageService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/kurento")
//@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class KurentoController {

    private final StorageService storageService;

    @GetMapping("/download/{name}")
    public ResponseEntity<Resource> download(HttpServletResponse response, @PathVariable("name") String name) throws IOException {
        Resource resource = storageService.loadVideoAsResource(name);
        String encodedUploadFileName = UriUtils.encode(name, StandardCharsets.UTF_8);

//        response.setContentType("application/octet-stream");
//        response.setHeader("Content-Disposition", "attachment; fileName=\"" + encodedUploadFileName);
//        response.setHeader("Content-Transfer-Encoding", "binary");
//        response.getOutputStream().flush();
//        response.getOutputStream().close();
        String contentDisposition = "attachment; filename=\"" + encodedUploadFileName + "\"";
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                contentDisposition).body(resource);

    }

    @DeleteMapping("/delete/{name}")
    public void delete(HttpServletResponse response, @PathVariable String name) throws IOException {
        System.out.println("delete 컨트롤러 연결");

        storageService.deleteVideo(name);
        return;
    }
}
