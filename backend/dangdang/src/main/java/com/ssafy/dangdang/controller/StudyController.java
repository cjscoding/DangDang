package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.service.StudyService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.util.List;

import static com.ssafy.dangdang.util.ApiUtils.*;

@RestController
@RequestMapping("/study")
@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class StudyController {

    private final StudyService studyService;

    @Operation(summary = "스터디 조회", description = "개설된 모든 스터디를 요청한 페이지 만큼 조회")
    @GetMapping()
    public ApiResult<Page<StudyDto>> getAllStudies(Pageable pageable){
        System.out.println(pageable.getOffset());
        System.out.println(pageable.getPageNumber());
        System.out.println(pageable.getPageSize());
        Page<StudyDto> allStudies = studyService.getAllStudies(pageable);

        return  success(allStudies);
    }


    @PostMapping()
    @PreAuthorize("hasRole('USER')")
    public ApiResult<StudyDto> createStudy(@CurrentUser PrincipalDetails userPrincipal
            ,@RequestBody @Valid StudyDto studyDto){

        User user = userPrincipal.getUser();
        log.info(user.toString());
        StudyDto study = studyService.createStudy(user, studyDto);
        return success(study);

    }

    @PatchMapping()
    @PreAuthorize("hasRole('USER')")
    public ApiResult<StudyDto> updateStudy(@CurrentUser PrincipalDetails userPrincipal
            ,@RequestBody @Valid StudyDto studyDto){

        User user = userPrincipal.getUser();
        log.info(user.toString());
        StudyDto study = studyService.createStudy(user, studyDto);
        return success(study);

    }


    @DeleteMapping("/{studyId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<String> deleteStudy(@CurrentUser PrincipalDetails userPrincipal
            , @PathVariable Long studyId){
        User user = userPrincipal.getUser();
        return studyService.deleteStudy(user, studyId);

    }

}
