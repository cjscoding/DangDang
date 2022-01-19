package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.domain.types.Email;
import com.ssafy.dangdang.domain.types.UserRoleType;
import com.ssafy.dangdang.exception.ExtantUserException;
import com.ssafy.dangdang.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;


    private final PasswordEncoder passwordEncoder;


    @Override
    @Transactional
    public void signUpUser(UserDto userDto) {
        String password = userDto.getPassword();

        if(this.idCheck(userDto)) throw new ExtantUserException("이미 존재하는 유저 입니다");

        String EncryptedPassword = passwordEncoder.encode(password);

        User user = User.builder()
                .email(Email.of(userDto.getEmail()))
                .nickname(userDto.getNickName())
                .password(EncryptedPassword)
                .role(UserRoleType.USER)
                .build();
        userRepository.save(user);

    }



    @Override
    public void updateUser(UserDto userDto) {
        String password = userDto.getPassword();

        if(!this.idCheck(userDto)) throw new ExtantUserException("존재하지 않는 유저 입니다");


        User user = userRepository.findUserByEmail(Email.of(userDto.getEmail())).get();

        String EncryptedPassword = passwordEncoder.encode(password);

        user = User.builder()
                .email(Email.of(userDto.getEmail()))
                .nickname(userDto.getNickName())
                .password(EncryptedPassword)
                .role(UserRoleType.USER)
                .build();
        userRepository.save(user);

    }



    @Override
    public boolean idCheck(UserDto userDto) {
        return userRepository.existsByEmail(Email.of(userDto.getEmail()));
    }

    @Override
    public boolean deleteUser(User user, String password) {


            if (passwordEncoder.matches(password, user.getPassword())) {
                userRepository.delete(user);
                return true;
            }
            return false;



    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findUserByEmail(Email.of(email));
    }


}
