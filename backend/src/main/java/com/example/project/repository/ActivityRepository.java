package com.example.project.repository;

import com.example.project.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

        List<Activity> findAllByUserIdOrderByTimestampDesc(Long userId);
    }

