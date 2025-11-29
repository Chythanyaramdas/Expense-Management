package com.example.project.controller;

import com.example.project.dto.CreateGroupRequest;
import com.example.project.dto.GroupDetails;
import com.example.project.model.Group;
import com.example.project.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/group")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/create")
    public Group createGroup(@RequestBody CreateGroupRequest request) {
        return groupService.createGroup(request.name, request.userIds);
    }

    @PostMapping("/{groupId}/addUser/{userId}")
    public Group addUser(@PathVariable Long groupId, @PathVariable Long userId) {
        return groupService.addUserToGroup(groupId, userId);
    }

    @DeleteMapping("/{groupId}/removeUser/{userId}")
    public Group removeUser(@PathVariable Long groupId, @PathVariable Long userId) {
        return groupService.removeUserFromGroup(groupId, userId);
    }

    @GetMapping("/{groupId}")
    public GroupDetails getGroup(@PathVariable Long groupId) {
        return groupService.getGroupDetails(groupId);
    }

    @GetMapping("/user/{userId}")
    public List<Group> getGroupsForUser(@PathVariable Long userId) {
        return groupService.getGroupForUser(userId);
    }
}
