package com.example.project.repository;

import com.example.project.model.Group;
import com.example.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findAllByUsersContaining(User user);
    Optional<Group> findByName(String name);
}
