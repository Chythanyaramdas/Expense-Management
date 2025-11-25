package com.example.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.project.model.User;
import com.example.project.service.UserService;


@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;


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
    public String login(@RequestBody User user) {
        User loggedIn = userService.loginUser(user.getUsername(), user.getPassword());
        if (loggedIn != null) {
            return "Login successful";
        } else {
            return "Invalid credentials";
        }
    }
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id).orElse(null);
    }

}
