package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.dto.ManageStudy;
import com.ssafy.dangdang.domain.dto.StudyDto;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.exception.BadRequestException;
import com.ssafy.dangdang.service.JoinsService;
import com.ssafy.dangdang.service.StudyService;
import com.ssafy.dangdang.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ssafy.dangdang.util.ApiUtils.*;


@RestController
@RequestMapping("/joins")
//@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class JoinsController {


    private final UserService userService;
    private final StudyService studyService;
    private final JoinsService joinsService;

    @Operation(summary = "가입한 스터디 조회", description = "로그인한 유저가 가입한 스터디 리스트 조회")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 조회 성공")
    })
    @GetMapping
    public ApiResult<Page<StudyDto>> getStudiesJoinedWithPage(@CurrentUser PrincipalDetails userPrincipal,
                                                              @RequestParam(required = false)
                                                              @Parameter(description = "해쉬태그를 이용해서 검색할 시 적용") List<String> hashtags,
                                                              @ParameterObject Pageable pageable){
        Page<StudyDto> studiesJoined = joinsService.getStudiesJoinedWithPage(userPrincipal.getUser(), hashtags, pageable);
        return success(studiesJoined);

    }

    @Operation(summary = "스터디 가입 신청", description = "로그인한 유저를 가입 대기자 목록에 추가함, 이미 대기자 목록에 추가되어 있는 유저가 호출할 경우, 가입신청을 취소함")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 가입 성공")
    })
    @PostMapping()
    @PreAuthorize("hasRole('USER')")
    public ApiResult<Long> joinStudy(@CurrentUser PrincipalDetails userPrincipal, @RequestBody ManageStudy manageStudy){
        Long enterId = joinsService.joinStudy(userPrincipal.getUser(), manageStudy.getStudyId());
        if(enterId == -1) throw new BadRequestException("정확한 값을 입력해주세요");
        return success(enterId);

    }

    @Operation(summary = "가입요청 수락", description = "스터디장이 유저의 가입 요청 수락")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "가입요청 수락 성공")
    })
    @PatchMapping()
    @PreAuthorize("hasRole('USER')")
    public ApiResult<Long> acceptUser(@CurrentUser PrincipalDetails userPrincipal, @RequestBody ManageStudy manageStudy){
        Long enterId = joinsService.acceptUser(userPrincipal.getUser(), manageStudy.getUserId(), manageStudy.getStudyId());
        if(enterId == -1) throw new BadRequestException("정확한 값을 입력해주세요");
        return success(enterId);
    }

    @Operation(summary = "가입 신청자 리스트 조회")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "가입 신청자 리스트 성공")
    })
    @GetMapping("/waiting/{studyId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<List<UserDto>> getWaitingUsers(@CurrentUser PrincipalDetails userPrincipal, @PathVariable Long studyId){
        List<UserDto> waitingUser = joinsService.getWaitingUser(userPrincipal.getUser(), studyId);
        return success(waitingUser);
    }

    @Operation(summary = "가입 신청 확인", description = "로그인해야 호출 가능")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "가입 신청 확인 성공")
    })
    @GetMapping("/{studyId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<Boolean> getJoin(@CurrentUser PrincipalDetails userPrincipal, @PathVariable Long studyId){
        Boolean join = joinsService.getJoin(userPrincipal.getUser(), studyId);
        return success(join);
    }

    @Operation(summary = "스터디 나가기")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디 나가기 성공")
    })
    @DeleteMapping("/{studyId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<String> outStudy(@CurrentUser PrincipalDetails userPrincipal, @PathVariable Long studyId){
        log.info(userPrincipal.getUser().toString());
        joinsService.outStudy(userPrincipal.getUser(),studyId);

        return success("삭제 성공");

    }

    @Operation(summary = "스터디원 내보내기")
    @ApiResponses( value = {
            @ApiResponse(responseCode = "200", description = "스터디원 내보내기 성공")
    })
    @DeleteMapping("/{studyId}/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ApiResult<String> outStudy(@CurrentUser PrincipalDetails userPrincipal, @PathVariable Long userId, @PathVariable Long studyId){
        log.info(userPrincipal.getUser().toString());
        joinsService.outStudy(userPrincipal.getUser(),userId, studyId);

        return success("삭제 성공");

    }


}
