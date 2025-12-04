package com.example.project.service;



import com.example.project.dto.SettlementResult;
import com.example.project.model.Expense;

import com.example.project.model.Group;
import com.example.project.model.User;
import com.example.project.repository.ExpenseRepository;
import com.example.project.repository.GroupRepository;
import com.example.project.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class ExpenseService {

    @Autowired
    ExpenseRepository expenseRepository;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    UserRepository userRepository;

    public Expense addExpense(Long groupId, String title, Double totalAmount,
                              Long paidById, String splitType,
                              List<Long> participantIds,
                              Map<Long, Double> exactShares) {

        Group group = groupRepository.findById(groupId).orElseThrow();
        User paidBy = userRepository.findById(paidById).orElseThrow();
        List<User> participants = userRepository.findAllById(participantIds);

        Expense expense = new Expense();
        expense.setGroup(group);
        expense.setTitle(title);
        expense.setAmount(totalAmount);
        expense.setPayer(paidBy);
        expense.setParticipants(participants);
        expense.setSplitType(splitType.toUpperCase());

        Map<Long, Double> userShares = new HashMap<>();

        // ========== SPLIT TYPE: EQUAL ==========
        if ("EQUAL".equalsIgnoreCase(splitType)) {

            double share = totalAmount / participants.size();

            for (User u : participants) {
                userShares.put(u.getId(), share);
            }
        }

        // ========== SPLIT TYPE: EXACT ==========
        else if ("EXACT".equalsIgnoreCase(splitType)) {

            if (exactShares == null || exactShares.isEmpty()) {
                throw new IllegalArgumentException("Exact shares required for EXACT split");
            }

            double sum = exactShares.values().stream().mapToDouble(d -> d).sum();

            if (Math.abs(sum - totalAmount) > 0.01) {
                throw new IllegalArgumentException("Exact shares do not add up to total amount");
            }

            userShares.putAll(exactShares);
        }

        // ========== INVALID SPLIT TYPE ==========
        else {
            throw new IllegalArgumentException("Invalid split type. Use EQUAL or EXACT.");
        }

        expense.setUserShares(userShares);

        return expenseRepository.save(expense);
    }
    public List<Expense> getExpensesByGroup(Long groupId) {
        return expenseRepository.findAllByGroupId(groupId);
    }


    public Map<Long, Double> calculateGroupBalances(Long groupId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<User> members = group.getUsers(); // Current group members
        List<Expense> expenses = expenseRepository.findAllByGroupId(groupId);

        // Initialize balances
        Map<Long, BigDecimal> balances = new HashMap<>();
        for (User user : members) {
            balances.put(user.getId(), BigDecimal.ZERO);
        }

        // Calculate balances
        for (Expense expense : expenses) {
            BigDecimal totalAmount = BigDecimal.valueOf(expense.getAmount());

            // Add to payer
            Long payerId = expense.getPayer().getId();
            balances.put(payerId, balances.getOrDefault(payerId, BigDecimal.ZERO).add(totalAmount));

            // Subtract from participants
            Map<Long, Double> userShares = expense.getUserShares();
            BigDecimal distributed = BigDecimal.ZERO;
            List<Long> participantIds = new ArrayList<>(userShares.keySet());

            for (int i = 0; i < participantIds.size(); i++) {
                Long uid = participantIds.get(i);
                BigDecimal share = BigDecimal.valueOf(userShares.get(uid)).setScale(2, RoundingMode.HALF_UP);

                if (i == participantIds.size() - 1) {
                    // Last participant absorbs rounding difference
                    share = totalAmount.subtract(distributed);
                } else {
                    distributed = distributed.add(share);
                }

                balances.put(uid, balances.getOrDefault(uid, BigDecimal.ZERO).subtract(share));
            }
        }

        // Convert to Double for frontend
        Map<Long, Double> finalBalances = new HashMap<>();
        for (Map.Entry<Long, BigDecimal> entry : balances.entrySet()) {
            finalBalances.put(entry.getKey(), entry.getValue().setScale(2, RoundingMode.HALF_UP).doubleValue());
        }

        return finalBalances;
    }

    @Transactional
    public List<SettlementResult> calculateSettlements(Long groupId) {
        Map<Long, Double> balances = calculateGroupBalances(groupId);

        Group group = groupRepository.findById(groupId).orElseThrow();
        Map<Long, User> userMap = group.getUsers().stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        List<Map.Entry<Long, Double>> creditors = balances.entrySet().stream()
                .filter(e -> e.getValue() > 0)
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .collect(Collectors.toList());

        List<Map.Entry<Long, Double>> debtors = balances.entrySet().stream()
                .filter(e -> e.getValue() < 0)
                .sorted((a, b) -> Double.compare(a.getValue(), b.getValue()))
                .collect(Collectors.toList());

        List<SettlementResult> settlements = new ArrayList<>();
        int i = 0, j = 0;

        while (i < creditors.size() && j < debtors.size()) {
            Long creditorId = creditors.get(i).getKey();
            Long debtorId = debtors.get(j).getKey();

            double credit = creditors.get(i).getValue();
            double debit = -debtors.get(j).getValue();

            double settleAmount = Math.min(credit, debit);

            settlements.add(new SettlementResult(
                    debtorId,
                    userMap.get(debtorId).getUsername(),
                    creditorId,
                    userMap.get(creditorId).getUsername(),
                    settleAmount,
                    userMap.get(debtorId).getUsername() + " owes " + userMap.get(creditorId).getUsername() + " ₹" + settleAmount
            ));

            creditors.get(i).setValue(credit - settleAmount);
            debtors.get(j).setValue(-(debit - settleAmount));

            if (credit - settleAmount == 0) i++;
            if (debit - settleAmount == 0) j++;
        }

        // ✅ Mark all expenses in this group as settled
        List<Expense> expenses = expenseRepository.findAllByGroupId(groupId);
        for (Expense expense : expenses) {
            expense.setSettled(true);
        }
        expenseRepository.saveAll(expenses);

        return settlements;
    }
    @Transactional
    public void markExpensesAsSettled(Long groupId) {
        List<Expense> expenses = expenseRepository.findAllByGroupId(groupId);

        for (Expense expense : expenses) {
            expense.setSettled(true);  // mark in memory
        }

        expenseRepository.saveAll(expenses);  // persist changes to DB
    }


}
