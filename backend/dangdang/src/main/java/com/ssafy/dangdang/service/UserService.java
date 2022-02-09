<<<<<<< Updated upstream
package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface UserService {

    public void signUpUser(UserDto userDto) ;


    void updateUser(User user, UserDto userDto);

    @Transactional
    void uploadImage(User user, String uuid, MultipartFile file);

    public boolean idCheck(UserDto userDto) ;

    public boolean deleteUser(User user, String password);

    public Optional<User> findByEmail(String email);

    Page<UserDto> findAllExceptAdmin(Pageable pageable);

    @Transactional
    void raiseToManager(Long userId);

    @Transactional
    void raiseToAdmin(Long userId);
}
=======
package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface UserService {

    public void signUpUser(UserDto userDto) ;


    void updateUser(User user, UserDto userDto);

    @Transactional
    void uploadImage(User user, String uuid, MultipartFile file);

    public boolean idCheck(UserDto userDto) ;

    public boolean deleteUser(User user, String password);


    public Optional<User> findByEmail(String email);

    Page<UserDto> findAllExceptAdmin(Pageable pageable);

    @Transactional
    void raiseToManager(Long userId);

    @Transactional
    void raiseToAdmin(Long userId);
}
>>>>>>> Stashed changes
