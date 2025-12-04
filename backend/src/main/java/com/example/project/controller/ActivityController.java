package com.example.project.controller;

import com.example.project.model.Activity;
import com.example.project.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activity")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping("/user/{userId}")
    public List<Activity> getActivity(@PathVariable Long userId) {

        return activityRepository.findAllByUserIdOrderByTimestampDesc(userId);
    }
}
