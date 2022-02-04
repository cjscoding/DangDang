package com.ssafy.dangdang.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    @Value("${file.upload.baseLocation}")
    private String baseLocation;
    @Value("${file.upload.file}")
    private String fileLocation;
    @Value("${file.upload.image}")
    private String imageLocation;

    @GetMapping("/images/{filename}")
    public Resource showImage(@PathVariable String filename) throws
            MalformedURLException {
        return new UrlResource("file:///" + imageLocation+filename);
    }
}
