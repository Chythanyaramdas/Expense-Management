package com.example.project.service;

import com.example.project.dto.GroupDetails;
import com.example.project.dto.SettlementResult;
import com.example.project.model.Expense;
import com.example.project.model.Group;
import com.example.project.model.Settlement;
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
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private SettleRepository settleRepository;


    // ---------------- CREATE GROUP ----------------
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

        // Add creator always
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Creator not found"));
        users.add(creator);

        // Remove duplicates
        group.setUsers(users.stream().distinct().toList());

        return groupRepository.save(group);
    }


    // ---------------- ADD USER ----------------
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


    // ---------------- REMOVE USER ----------------
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


    // ---------------- GROUP DETAILS ----------------
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


    // ---------------- GET GROUPS FOR USER ----------------
    public List<Group> getGroupsForUser(Long userId) {
        return groupRepository.findAllByUserId(userId);
    }


    // ---------------- DELETE GROUP ----------------
    @Transactional
    public void deleteGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // 1️⃣ Delete settlements FIRST
        settleRepository.deleteAllByGroupId(groupId);

        // 2️⃣ Delete expenses
        expenseRepository.deleteAll(expenseRepository.findAllByGroupId(groupId));

        // 3️⃣ Clear join table group_users
        group.getUsers().clear();
        groupRepository.saveAndFlush(group);

        // 4️⃣ Delete group
        groupRepository.delete(group);
    }

}
