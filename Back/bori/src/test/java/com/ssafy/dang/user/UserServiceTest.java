package com.ssafy.bori.user;

import com.ssafy.bori.domain.Salt;
import com.ssafy.bori.domain.User;
import com.ssafy.bori.domain.dto.UserDto;
import com.ssafy.bori.domain.types.Email;
import com.ssafy.bori.repository.SaltRepository;
import com.ssafy.bori.repository.UserRepository;
import com.ssafy.bori.service.UserService;
import com.ssafy.bori.util.SaltUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;
    @Autowired
    private SaltRepository saltRepository;
    @Autowired
    private SaltUtil saltUtil;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void signUp(){
        UserDto userDto = new UserDto();

        userDto.setEmail("test@ssafy.com");
        userDto.setNickName("Bori");
        userDto.setPassword("test@ssafy.com");

        userService.signUpUser(userDto);

        User user = userRepository.findUserByEmail(Email.of(userDto.getEmail())).get();

        System.out.println("user:"+ user.toString());
        System.out.println("userDto" + userDto.toString());

        Assertions.assertEquals(userDto.getNickName(), user.getNickname());
        String EncryptedPassword = saltUtil.encodePassword(user.getSalt().getSalt(), userDto.getPassword());
        Assertions.assertEquals( EncryptedPassword, user.getPassword());
        Assertions.assertEquals(userDto.getEmail().toString(), user.getEmail().toString());


    }
}
