package com.fin.billage.domain.user.api;

import com.fin.billage.domain.user.dto.UserLoginRequestDto;
import com.fin.billage.domain.user.dto.UserSignUpRequestDto;
import com.fin.billage.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserSignUpRequestDto userSignUpRequestDto) {
        return new ResponseEntity(userService.signup(userSignUpRequestDto), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequestDto userLoginRequestDto) {
        return new ResponseEntity<>(userService.login(userLoginRequestDto), HttpStatus.OK);
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        return new ResponseEntity<>(userService.logout(request), HttpStatus.OK);
    }
}
