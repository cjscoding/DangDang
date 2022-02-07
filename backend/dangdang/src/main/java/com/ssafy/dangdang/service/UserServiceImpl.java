package com.ssafy.dangdang.service;

import com.ssafy.dangdang.domain.Comment;
import com.ssafy.dangdang.domain.User;
import com.ssafy.dangdang.domain.dto.UserDto;
import com.ssafy.dangdang.domain.types.UserRoleType;
import com.ssafy.dangdang.exception.ExtantUserException;
import com.ssafy.dangdang.repository.CommentRepository;
import com.ssafy.dangdang.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    private final PasswordEncoder passwordEncoder;


    @Override
    @Transactional
    public void signUpUser(UserDto userDto) {
        String password = userDto.getPassword();

        if(this.idCheck(userDto)) throw new ExtantUserException("이미 존재하는 유저 입니다");

        String EncryptedPassword = passwordEncoder.encode(password);

        User user = User.builder()
                .email(userDto.getEmail())
                .nickname(userDto.getNickName())
                .password(EncryptedPassword)
                .role(UserRoleType.USER)
                .build();
        userRepository.save(user);

    }



    @Override
    @Transactional
    public void updateUser(User user, UserDto userDto) {


        //if(!this.idCheck(userDto)) throw new ExtantUserException("존재하지 않는 유저 입니다");

        String encryptedPassword = user.getPassword();
        if (userDto.getPassword() != null && userDto.getPassword().equals("")){
            String password = userDto.getPassword();
            encryptedPassword = passwordEncoder.encode(password);
        }


        user = User.builder()
                .id(user.getId())
                .email(userDto.getEmail())
                .nickname(userDto.getNickName())
                .password(encryptedPassword)
                .role(user.getRole())
                .build();
        userRepository.save(user);

    }

    @Override
    @Transactional
    public void uploadImage(User user, String uuid, MultipartFile file){
        // 컨트롤러에서 넘어온 유저는 OSIV 옵션이 꺼져있으면 준영속상태이기 때문에, 다시 조회해서 영속상태인 객체에서 값을 변경해야 더티체킹이 일어난다.
        user = userRepository.findById(user.getId()).get();
        user.addImageUrl(uuid + file.getOriginalFilename());
    }

    @Override
    public boolean idCheck(UserDto userDto) {
        return userRepository.existsByEmail(userDto.getEmail());
    }

    @Override
    @Transactional
    public boolean deleteUser(User user, String password) {

        //TODO: 유저가 단 댓글을 삭제할 지 정해야함
            if (passwordEncoder.matches(password, user.getPassword())) {

                //TODO: 나중에 벌크 수정 쿼리로 바꾸기
                List<Comment> comments = commentRepository.findCommentByWriterEmail(user.getEmail());
                comments.forEach(Comment::disappear);
                commentRepository.saveAll(comments);

                userRepository.delete(user);
                return true;
            }
            return false;

    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    @Transactional
    public Page<UserDto> findAllExceptAdmin(Pageable pageable){
        Page<User> users = userRepository.findAllExceptAdmin(pageable);
        return users.map(UserDto::of);
    }

    @Override
    @Transactional
    public void raiseToManager(Long userId){
        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) throw new NullPointerException("존재하지 않는 유저 입니다.");
        user.get().raiseToManager();
    }

    @Override
    @Transactional
    public void raiseToAdmin(Long userId){
        Optional<User> user = userRepository.findById(userId);
        if (!user.isPresent()) throw new NullPointerException("존재하지 않는 유저 입니다.");
        user.get().raiseToAdmin();
    }


}
