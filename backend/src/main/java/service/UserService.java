package service;

import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public User registerUser(User user){
        return userRepository.save(user);
    }

    public User loginUser(String username,String password){
        return userRepository.findByUsernameAndPassword(username,password).orElse(null);
    }

    public Optional<User> getUser(Long id){
        return userRepository.findById(id);
    }
}
