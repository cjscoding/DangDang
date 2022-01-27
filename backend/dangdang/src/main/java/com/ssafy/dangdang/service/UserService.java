package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.UserDto;

import java.util.Optional;

public interface UserService {

    public void signUpUser(UserDto userDto) ;

    public void updateUser(UserDto userDto);

    public boolean idCheck(UserDto userDto) ;

    public boolean deleteUser(User user, String password);

    public Optional<User> findByEmail(String email);
}
