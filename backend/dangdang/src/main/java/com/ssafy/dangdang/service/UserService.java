package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.dto.UserDto;

public interface UserService {

    public void signUpUser(UserDto userDto) ;

    public void updateUser(UserDto userDto);
    

    public boolean idCheck(UserDto userDto) ;


    public boolean deleteUser(UserDto userDto);
}
