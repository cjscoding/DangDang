package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.ManageStudy;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.exception.BadRequestException;
import com.ssafy.dangdang.service.JoinsService;
import com.ssafy.dangdang.service.StudyService;
import com.ssafy.dangdang.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ssafy.dangdang.util.ApiUtils.*;


@RestController
@RequestMapping("/joins")
@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class JoinsController {


    private final UserService userService;
    private final StudyService studyService;
    private final JoinsService joinsService;

    @GetMapping
    public ApiResult<Page<StudyDto>> getStudiesJoinedWithPage(@CurrentUser PrincipalDetails userPrincipal, Pageable pageable){
        Page<StudyDto> studiesJoined = joinsService.getStudiesJoinedWithPage(userPrincipal.getUser(), pageable);
        return success(studiesJoined);

    }

    @PostMapping()
    public ApiResult<Long> joinStudy(@CurrentUser PrincipalDetails userPrincipal, @RequestBody ManageStudy manageStudy){
        Long enterId = joinsService.joinStudy(userPrincipal.getUser(), manageStudy.getId());
        if(enterId == -1) throw new BadRequestException("정확한 값을 입력해주세요");
        return success(enterId);

    }

    @PatchMapping()
    public ApiResult<Long> acceptUser(@CurrentUser PrincipalDetails userPrincipal, @RequestBody ManageStudy manageStudy){
        Long enterId = joinsService.acceptUser(userPrincipal.getUser(), manageStudy.getUserId(), manageStudy.getId());
        if(enterId == -1) throw new BadRequestException("정확한 값을 입력해주세요");
        return success(enterId);
    }

    @GetMapping("/waiting/{studyId}")
    public ApiResult<List<UserDto>> getWaitingUsers(@CurrentUser PrincipalDetails userPrincipal, @PathVariable Long studyId){
        List<UserDto> waitingUser = joinsService.getWaitingUser(userPrincipal.getUser(), studyId);
        return success(waitingUser);
    }

    @DeleteMapping("/{studyId}")
    public ApiResult<String> outStudy(@CurrentUser PrincipalDetails userPrincipal, @PathVariable Long studyId){
        log.info(userPrincipal.getUser().toString());
        joinsService.outStudy(userPrincipal.getUser(),studyId);

        return success("삭제 성공");

    }


}
