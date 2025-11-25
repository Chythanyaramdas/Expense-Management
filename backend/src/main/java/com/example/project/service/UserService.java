package com.example.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.project.model.User;
import com.example.project.repository.UserRepository;


import java.util.Optional;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public User registerUser(User user){
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        return userRepository.save(user);
    }

    public User loginUser(String username,String password){
        return userRepository.findByUsernameAndPassword(username,password).orElse(null);
    }

    public Optional<User> getUser(Long id){
        return userRepository.findById(id);
    }
}