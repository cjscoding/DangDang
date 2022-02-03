package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserService {

    public void signUpUser(UserDto userDto) ;

    public void updateUser(UserDto userDto);

    public boolean idCheck(UserDto userDto) ;

    public boolean deleteUser(User user, String password);

    public Optional<User> findByEmail(String email);

    Page<UserDto> findAllExceptAdmin(Pageable pageable);

    @Transactional
    void raiseToManager(Long userId);

    @Transactional
    void raiseToAdmin(Long userId);
}
