package com.ssafy.dangdang;

import com.ssafy.dangdang.config.security.auth.PrincipalDetailsService;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.domain.types.Email;
import com.ssafy.dangdang.repository.UserRepository;
import com.ssafy.dangdang.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;

@Component
@RequiredArgsConstructor
public class InitDb {

    private final InitService initService;


    @PostConstruct
    public void init(){
        initService.signUpUsers();;
    }

    //위 init()함수에 아래 내용을 전부 포함해도 된다고 생각할 수 있지만,
    //Bean의 생명주기 때문에, @Transactional같은 어노테이션을 사용하려면
    //아래와 같이 별도의 클래스를 사용해야한다.
    @Component
    @Transactional
    @RequiredArgsConstructor
    static class InitService{
        private final PrincipalDetailsService principalDetailsService;
        private final UserRepository userRepository;

        public void signUpUsers(){
            UserDto userDto = new UserDto();

            userDto.setEmail("test@ssafy.com");
            userDto.setNickName("Bori");
            userDto.setPassword("test@ssafy.com");

            principalDetailsService.signUpUser(userDto);
            for (int i=0;i<20;i++){
                userDto = new UserDto();
                userDto.setEmail("test"+i+"@ssafy.com");
                userDto.setNickName("Bori"+i);
                userDto.setPassword("test"+i+"@ssafy.com");

                principalDetailsService.signUpUser(userDto);
            }

            //User user = userRepository.findUserByEmail(Email.of(userDto.getEmail())).get();
        }
    }

}
