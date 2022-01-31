package com.ssafy.dangdang.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;

@RestController
@RequestMapping("/kurento")
@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class KurentoController {



    @GetMapping("/download/{name}")
    public void download(HttpServletResponse response, @PathVariable String name) throws IOException {
        System.out.println();
        System.out.println(name+":: 컨트롤러 연결");
        String path = "/home/ssafy/share/"+name;

        byte[] fileByte = FileUtils.readFileToByteArray(new File(path));

        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; fileName=\"" + URLEncoder.encode(name, "UTF-8")+"\";");
        response.setHeader("Content-Transfer-Encoding", "binary");

        response.getOutputStream().write(fileByte);
        response.getOutputStream().flush();
        response.getOutputStream().close();
    }

    @GetMapping("/delete")
    public void delete(HttpServletResponse response) throws IOException {
        System.out.println("delete 컨트롤러 연결");
        int cnt=1;
        while(true){
            String filePath = "/home/ssafy/share/"+cnt+"HelloWorldRecorded.webm";
            File deleteFile = new File(filePath);
            // 파일이 존재하는지 체크 존재할경우 true, 존재하지않을경우 false
            if(deleteFile.exists()) {
                deleteFile.delete();
                System.out.println("파일 삭제");
                cnt++;
            } else {
                System.out.println("파일 없음");
                break;
            }
        }
        return;
    }
}
