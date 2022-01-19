package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.dto.UserDto;

public interface EnterService {



    public Long enterStudy(UserDto userDto, Long studyId);

    public void oustStudy(UserDto userDto, Long studyId);
}
