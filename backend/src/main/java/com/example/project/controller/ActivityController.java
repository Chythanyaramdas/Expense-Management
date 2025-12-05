package com.example.project.controller;

import com.example.project.model.Activity;
import com.example.project.repository.ActivityRepository;
import com.example.project.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activity")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ActivityService activityService;

    @GetMapping("/user/{userId}")
    public List<Activity> getActivity(@PathVariable Long userId) {

        return activityRepository.findAllByUserIdOrderByTimestampDesc(userId);
    }

    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<String> clearUserActivity(@PathVariable Long userId) {

        activityService.clearAllActivityForUser(userId);
        return ResponseEntity.ok("Activity cleared");
    }

}
