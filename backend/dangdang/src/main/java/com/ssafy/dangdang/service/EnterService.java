package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.UserDto;

public interface EnterService {



    public Long enterStudy(User user, Long studyId);

    public void outStudy(User user, Long studyId);
}
