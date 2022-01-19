package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Study;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.StudyDto;
import org.springframework.data.domain.Page;

public interface StudyService {

    public Study createStudy(User user, Study Study);

    public Study updateStudy(User user, Study Study);

    public boolean deleteStudy(User user, Study Study);

    public Page<StudyDto> getAllStudies();
}
