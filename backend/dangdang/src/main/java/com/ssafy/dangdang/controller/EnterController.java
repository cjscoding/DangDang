package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.dto.ManageStudy;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.service.EnterService;
import com.ssafy.dangdang.service.StudyService;
import com.ssafy.dangdang.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.ssafy.dangdang.util.ApiUtils.*;


@RestController
@RequestMapping("/enter")
@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class EnterController {


    private final UserService userService;
    private final StudyService studyService;
    private final EnterService enterService;


    @PostMapping()
    public ApiResult<Long> enterStudy(@CurrentUser PrincipalDetails userPrincipal, @RequestBody ManageStudy manageStudy){
        Long enterId = enterService.enterStudy(userPrincipal.getUser(), manageStudy.getId());
        if(enterId != -1) error("정확한 값을 입력해 주세요", HttpStatus.BAD_REQUEST);
        return success(enterId);

    }

    @DeleteMapping()
    public ApiResult<String> outStudy(@CurrentUser PrincipalDetails userPrincipal, @RequestBody ManageStudy manageStudy){
        enterService.outStudy(userPrincipal.getUser(), manageStudy.getId());

        return success("삭제 성공");

    }


}
