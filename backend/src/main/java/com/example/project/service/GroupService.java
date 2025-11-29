package com.example.project.service;

import com.example.project.dto.GroupDetails;
import com.example.project.model.Group;
import com.example.project.model.User;
import com.example.project.repository.GroupRepository;
import com.example.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseService expenseService;

    // CREATE GROUP
    public Group createGroup(String name, List<Long> userIds) {

        if (groupRepository.findByName(name).isPresent()) {
            throw new RuntimeException("Group name already exists");
        }

        Group group = new Group();
        group.setName(name);

        List<User> users = userRepository.findAllById(userIds);
        if (users.isEmpty()) {
            throw new RuntimeException("Invalid user list");
        }

        group.setUsers(users);

        return groupRepository.save(group);
    }

    // ADD USER
    public Group addUserToGroup(Long groupId, Long userId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (group.getUsers().contains(user)) {
            throw new RuntimeException("User already in group");
        }

        group.getUsers().add(user);
        return groupRepository.save(group);
    }

    // REMOVE USER
    public Group removeUserFromGroup(Long groupId, Long userId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!group.getUsers().contains(user)) {
            throw new RuntimeException("User is not in group");
        }

        group.getUsers().remove(user);
        return groupRepository.save(group);
    }

    // GROUP DETAILS
    public GroupDetails getGroupDetails(Long groupId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Map<Long, Double> balances = expenseService.calculateGroupBalances(groupId);

        GroupDetails dto = new GroupDetails();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setMembers(group.getUsers());
        dto.setBalances(balances);

        return dto;
    }

    // GET ALL GROUPS FOR USER
    public List<Group> getGroupForUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return groupRepository.findAllByUsersContaining(user);
    }
}
