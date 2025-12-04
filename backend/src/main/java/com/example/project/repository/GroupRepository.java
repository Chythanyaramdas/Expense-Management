package com.example.project.repository;

import com.example.project.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {

    @Query("SELECT DISTINCT g FROM Group g LEFT JOIN FETCH g.users u WHERE u.id = :userId")
    List<Group> findAllByUserId(@Param("userId") Long userId);

    Optional<Group> findByName(String name);
}

