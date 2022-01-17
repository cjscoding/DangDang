package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.dto.LoginRequest;
import com.ssafy.dangdang.domain.dto.UserDto;

public interface UserService {

    public void signUpUser(UserDto userDto) ;

    public void updateUser(UserDto userDto);


    public LoginRequest loginUser(String email, String password) throws Exception ;


    public boolean idCheck(UserDto userDto) ;


}
