package com.example.project.service;

import com.example.project.dto.GroupDetails;
import com.example.project.model.Group;
import com.example.project.model.User;
import com.example.project.repository.ExpenseRepository;
import com.example.project.repository.GroupRepository;
import com.example.project.repository.SettleRepository;
import com.example.project.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    @Autowired
    private ActivityService activityService;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private SettleRepository settleRepository;


    public Group createGroup(String name, List<Long> userIds, Long creatorId) {

        if (name == null || name.trim().isEmpty())
            throw new RuntimeException("Group name is required");

        if (groupRepository.findByName(name).isPresent())
            throw new RuntimeException("Group name already exists");

        Group group = new Group();
        group.setName(name);

        List<User> users = new ArrayList<>();

        if (userIds != null && !userIds.isEmpty()) {
            users.addAll(userRepository.findAllById(
                    userIds.stream().distinct().toList()
            ));
        }

        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Creator not found"));
        users.add(creator);

        group.setUsers(users.stream().distinct().toList());

        Group savedGroup = groupRepository.save(group);

        activityService.log(
                creatorId,
                savedGroup.getId(),
                null,
                "Created group '" + savedGroup.getName() + "'"
        );

        return savedGroup;
    }

    public Group addUserToGroup(Long groupId, Long userId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (group.getUsers().contains(user))
            throw new RuntimeException("User already in group");

        group.getUsers().add(user);

        return groupRepository.save(group);
    }

    public Group removeUserFromGroup(Long groupId, Long userId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!group.getUsers().contains(user))
            throw new RuntimeException("User is not in this group");

        Map<Long, Double> balances = expenseService.calculateGroupBalances(groupId);

        if (balances.getOrDefault(userId, 0.0) != 0)
            throw new RuntimeException("Cannot remove user with non-zero balance");

        boolean hasPending = expenseService.calculateSettlements(groupId)
                .stream()
                .anyMatch(s -> s.getPayerId().equals(userId)
                        || s.getReceiverId().equals(userId));

        if (hasPending)
            throw new RuntimeException("Cannot remove user with pending settlements");

        group.getUsers().remove(user);

        return groupRepository.save(group);
    }

    public GroupDetails getGroupDetails(Long groupId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        GroupDetails dto = new GroupDetails();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setMembers(group.getUsers());
        dto.setBalances(expenseService.calculateGroupBalances(groupId));

        return dto;
    }

    public List<Group> getGroupsForUser(Long userId) {

        return groupRepository.findAllByUserId(userId);
    }

    @Transactional
    public void deleteGroup(Long groupId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        settleRepository.deleteAllByGroupId(groupId);
        expenseRepository.deleteAll(expenseRepository.findAllByGroupId(groupId));
        group.getUsers().clear();
        groupRepository.saveAndFlush(group);
        groupRepository.delete(group);
    }

}
