package com.ssafy.dangdang.controller;

import com.ssafy.dangdang.config.security.CurrentUser;
import com.ssafy.dangdang.config.security.auth.PrincipalDetails;
import com.ssafy.dangdang.domain.Resume;
import com.ssafy.dangdang.domain.dto.DeleteRequest;
import com.ssafy.dangdang.domain.dto.ResumeDto;
import com.ssafy.dangdang.domain.projection.ResumeMapping;
import com.ssafy.dangdang.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.util.List;
import java.util.Optional;

import static com.ssafy.dangdang.util.ApiUtils.*;


@RestController
@RequestMapping("/resume")
@CrossOrigin(origins = {"http://localhost:3000"}, allowedHeaders = "*")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping("/{userId}")
    public ApiResult<List<ResumeMapping>> getResumes(@PathVariable Long userId){
        List<ResumeMapping> resumes = resumeService.getResumes(userId);
        System.out.println(resumes);
        return success(resumes);
    }

    @PostMapping()
    public ApiResult<ResumeDto> writeResume(@CurrentUser PrincipalDetails userPrincipal, @RequestBody ResumeDto resumeDto){
        ResumeDto newResume = ResumeDto.of(resumeService.writeResume(userPrincipal.getUser(),
                resumeDto.getResumeQuestionList()));
        return success(newResume);
    }

    // 처음 쓸 때는, ResumeDto에 ID가 필요없지만,
    // 수정할 때는 필요하기 때문에 @Valid옵션을 줌
    @PatchMapping()
    public ApiResult<ResumeDto> updateResume(@CurrentUser PrincipalDetails userPrincipal, @RequestBody @Valid ResumeDto resumeDto){
        ResumeDto newResume = ResumeDto.of(resumeService.updateResume(userPrincipal.getUser(),
                resumeDto));
        return success(newResume);
    }

    @DeleteMapping("/{resumeId}")
    public  ApiResult<String> deleteResume(@CurrentUser PrincipalDetails userPrincipal, @PathVariable Long resumeId){

            resumeService.deleteResume(userPrincipal.getUser(), resumeId);
        return success("삭제 성공");
    }
}
