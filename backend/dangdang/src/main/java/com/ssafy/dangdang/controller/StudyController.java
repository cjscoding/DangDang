package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.service.StudyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import static com.ssafy.dangdang.util.ApiUtils.ApiResult;
import static com.ssafy.dangdang.util.ApiUtils.success;

@RestController
@RequestMapping("/study")
@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class StudyController {

    private final StudyService studyService;

    @PostMapping()
    @PreAuthorize("hasRole('USER')")
    public ApiResult<StudyDto> createStudy(@CurrentUser PrincipalDetails userPrincipal,@RequestBody @Valid StudyDto studyDto){
        User user = userPrincipal.getUser();
        log.info(user.toString());
        Study study = Study.of(user, studyDto);
        StudyDto createdStudy = StudyDto.of(studyService.createStudy(user, study));
        return success(createdStudy);

    }

}
