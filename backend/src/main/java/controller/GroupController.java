package controller;

import dto.CreateGroupRequest;
import dto.GroupDetails;
import model.Group;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import service.GroupService;

import java.util.List;

@RestController
@RequestMapping("/group")
public class GroupController {

    @Autowired
    GroupService groupService;


    @PostMapping("/create")
    public Group createGroup(@RequestBody CreateGroupRequest request) {
        return groupService.createGroup(request.name, request.userIds);
    }

    @PostMapping("/{groupId}/addUser/{userId}")
    public Group addUser(@PathVariable Long groupId, @PathVariable Long userId) {
        return groupService.addUserToGroup(groupId, userId);
    }


    @GetMapping("/{groupId}")
    public GroupDetails getGroup(@PathVariable Long groupId) {
        return groupService.getGroupDetails(groupId);
    }

    @GetMapping("/user/{userId}")
    public List<Group> getGroupsForUser(@PathVariable Long userId) {
        return groupService.getGroupForUser(userId);
    }

    @DeleteMapping("/{groupId}/removeUser/{userId}")
    public Group removeUser(@PathVariable Long groupId, @PathVariable Long userId) {
        return groupService.removeUserFromGroup(groupId, userId);
    }

}
