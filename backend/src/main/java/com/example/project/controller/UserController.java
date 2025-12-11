package com.example.project.controller;

import com.example.project.exception.UserNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.project.model.User;
import com.example.project.service.UserService;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000",
        allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user, HttpServletResponse response) {
        User loggedIn = userService.loginUser(user.getUsername(), user.getPassword());
        if (loggedIn != null) {
            String encodedUsername = URLEncoder.encode(loggedIn.getUsername(), StandardCharsets.UTF_8);
            Cookie cookie = new Cookie("username", encodedUsername);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60);

            cookie.setSecure(false);

            response.addCookie(cookie);

            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {

        User user = userService.getUser(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("username", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok("Logged out");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @CookieValue(value = "username", defaultValue = "") String username) {

        try {
            username = URLDecoder.decode(username, StandardCharsets.UTF_8);
        } catch (Exception ignored) {}

        if (username.isEmpty()) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        User foundUser = userService.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return ResponseEntity.ok(foundUser);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser,
            HttpServletResponse response) {

        User savedUser = userService.updateUser(id, updatedUser);
        String encodedUsername = URLEncoder.encode(savedUser.getUsername(), StandardCharsets.UTF_8);
        Cookie cookie = new Cookie("username", encodedUsername);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setSecure(false);
        response.addCookie(cookie);

        return ResponseEntity.ok(savedUser);
    }
}
