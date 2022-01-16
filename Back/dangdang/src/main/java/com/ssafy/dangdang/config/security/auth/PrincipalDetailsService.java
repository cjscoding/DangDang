package com.ssafy.dangdang.config.security.auth;

import com.ssafy.dangdang.domain.Salt;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.LoginRequest;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.domain.types.Email;
import com.ssafy.dangdang.domain.types.UserRoleType;
import com.ssafy.dangdang.repository.SaltRepository;
import com.ssafy.dangdang.repository.UserRepository;
import com.ssafy.dangdang.util.SaltUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final SaltRepository saltRepository;
    private final SaltUtil saltUtil;

    @Override
    public PrincipalDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findUserByEmail(Email.of(username));
        if(user.isEmpty()){
            throw new UsernameNotFoundException(username + " : 사용자 존재하지 않음");
        }
        // session.setAttribute("loginUser", user);
        return new PrincipalDetails(user.get());
    }


    public void signUpUser(UserDto userDto) {
        String password = userDto.getPassword();

        // TODO: EXCEPTION 상세화
        try {
            long count = this.idCheck(userDto);
            if(count>0) throw new Exception();
        } catch (Exception e) {
            e.printStackTrace();
            log.error("이미 존재하는 ID입니다.");
            return;
        }
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


    public LoginRequest loginUser(String email, String password) throws Exception {

        User user = userRepository.findUserByEmail(Email.of(email)).orElseThrow( () -> new EntityNotFoundException("없는 유저 입니다"));

        Salt salt = saltRepository.findSaltById(user.getSalt().getId());



        log.info("salt:"+salt);
        password = saltUtil.encodePassword(salt.getSalt(), password);
        log.info("pwd:"+password);
        log.info("user:"+user.getPassword());
        if(!user.getPassword().equals(password))
            throw new Exception ("비밀번호가 틀립니다.");
//        if(user.getSocial()!=null) //나중에 추가 예정
//            throw new Exception ("소셜 계정으로 로그인 해주세요.");
        return new LoginRequest(email, password);
    }


    public long idCheck(UserDto userDto) {
        return userRepository.countUserByEmail(Email.of(userDto.getEmail()));
    }
}
