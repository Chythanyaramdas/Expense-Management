package com.example.project.service;

import com.example.project.model.Activity;
import com.example.project.repository.ActivityRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    public void log(Long userId, Long groupId, Long expenseId, String message) {

        Activity activity = new Activity();
        activity.setUserId(userId);
        activity.setGroupId(groupId);
        activity.setExpenseId(expenseId);
        activity.setMessage(message);
        activity.setTimestamp(LocalDateTime.now());
        activityRepository.save(activity);
    }

    @Transactional
    public void clearAllActivityForUser(Long userId) {
        activityRepository.deleteAllByUserId(userId);
    }

}
