package com.ssafy.bori.service;

import com.ssafy.bori.domain.Salt;
import com.ssafy.bori.domain.dto.UserDto;
import com.ssafy.bori.domain.types.Email;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    void signUpUser(UserDto userDto);

    UserDto loginUser(String email, String password) throws Exception;

    int idCheck(UserDto userDto);

}
