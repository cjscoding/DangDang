package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Salt;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.domain.types.Email;
import com.ssafy.dangdang.domain.types.UserRoleType;
import com.ssafy.dangdang.exception.ExtantUserException;
import com.ssafy.dangdang.repository.SaltRepository;
import com.ssafy.dangdang.repository.UserRepository;
import com.ssafy.dangdang.util.SaltUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final SaltRepository saltRepository;
    private final SaltUtil saltUtil;

    @Override
    public void signUpUser(UserDto userDto) {
        String password = userDto.getPassword();

        // TODO: EXCEPTION 상세화


        if(this.idCheck(userDto)) throw new ExtantUserException("이미 존재하는 유저 입니다");
        String saltValue = saltUtil.genSalt();
        Salt salt = Salt.builder()
                .salt(saltValue)
                .build();
        String EncryptedPassword = saltUtil.encodePassword(saltValue, password);

        saltRepository.save(salt);
        User user = User.builder()
                .email(Email.of(userDto.getEmail()))
                .nickname(userDto.getNickName())
                .password(EncryptedPassword)
                .role(UserRoleType.USER)
                .salt(salt)
                .build();
        userRepository.save(user);

    }
    @Override
    public void updateUser(UserDto userDto) {
        String password = userDto.getPassword();

        // TODO: EXCEPTION 상세화


        if(!this.idCheck(userDto)) throw new ExtantUserException("존재하지 않는 유저 입니다");


        User user = userRepository.findUserByEmail(Email.of(userDto.getEmail())).get();
        Salt salt = saltRepository.findSaltById(user.getSalt().getId());
        String EncryptedPassword = saltUtil.encodePassword(salt.getSalt(), password);

        saltRepository.save(salt);
        user = User.builder()
                .email(Email.of(userDto.getEmail()))
                .nickname(userDto.getNickName())
                .password(EncryptedPassword)
                .role(UserRoleType.USER)
                .salt(salt)
                .build();
        userRepository.save(user);

    }



    @Override
    public boolean idCheck(UserDto userDto) {
        return userRepository.existsByEmail(Email.of(userDto.getEmail()));
    }

    @Override
    public boolean deleteUser(UserDto userDto) {
        Optional<User> userByEmail = userRepository.findUserByEmail(Email.of(userDto.getEmail()));

        if (userByEmail.isPresent()){
            User user = userByEmail.get();
            Salt salt = saltRepository.findSaltById(user.getSalt().getId());
            String EncryptedPassword = saltUtil.encodePassword(salt.getSalt(), userDto.getPassword());
            if (user.getPassword().equals(EncryptedPassword)){
                userRepository.delete(user);
                return true;
            }
            return false;

        } else return false;

    }


}
