package com.example.project.service;

import com.example.project.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.project.model.User;
import com.example.project.repository.UserRepository;


import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public User registerUser(User user){

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        String passwordRegex =
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

        if (!user.getPassword().matches(passwordRegex)) {
            throw new RuntimeException(
                    "Weak password! Must be 8+ chars with uppercase, lowercase, number, and special character."
            );
        }

        return userRepository.save(user);
    }


    public User loginUser(String username,String password){
        return userRepository.findByUsernameAndPassword(username,password).orElse(null);
    }

    public Optional<User> getUser(Long id){
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User updateUser(Long id, User updatedUser) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        existingUser.setUsername(updatedUser.getUsername());

        String newPassword = updatedUser.getPassword();
        if (newPassword != null && !newPassword.isBlank()
                && !newPassword.equals(existingUser.getPassword())) {

            String passwordRegex =
                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

            if (!newPassword.matches(passwordRegex)) {
                throw new RuntimeException("Weak password! Must contain 8+ chars, uppercase, lowercase, number & special character.");
            }

            existingUser.setPassword(newPassword);
        }

        return userRepository.save(existingUser);
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}