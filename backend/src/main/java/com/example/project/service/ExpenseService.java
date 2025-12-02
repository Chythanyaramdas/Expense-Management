package com.example.project.service;



import com.example.project.dto.SettlementResult;
import com.example.project.model.Expense;

import com.example.project.model.Group;
import com.example.project.model.User;
import com.example.project.repository.ExpenseRepository;
import com.example.project.repository.GroupRepository;
import com.example.project.repository.UserRepository;
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

        List<Expense> expenses = expenseRepository.findAllByGroupId(groupId);
        // Use Double for the balances map to comply with the required return type
        Map<Long, Double> balances = new HashMap<>();

        for (Expense expense : expenses) {
            Long payerId = expense.getPayer().getId();
            Double amount = expense.getAmount();

            // 1. Accumulate Payer's positive balance (Paid money)
            balances.put(payerId, balances.getOrDefault(payerId, 0.0) + amount);

            // 2. Iterate over shares to deduct what is owed (Negative balance)
            // We must assume expense.getUserShares() returns Map<Long, Double> based on errors
            for (Map.Entry<Long, Double> entry : expense.getUserShares().entrySet()) {
                Long userId = entry.getKey();
                Double share = entry.getValue();

                balances.put(userId, balances.getOrDefault(userId, 0.0) - share);
            }
        }

        // 3. Mitigation Step: Round all final balances to eliminate floating-point errors
        Map<Long, Double> finalBalances = new HashMap<>();

        for (Map.Entry<Long, Double> entry : balances.entrySet()) {
            Long userId = entry.getKey();
            Double balance = entry.getValue();

            // Use BigDecimal for the rounding operation to ensure accuracy in rounding
            BigDecimal bd = new BigDecimal(balance);

            // Round to 2 decimal places (standard for currency) using commercial rounding
            bd = bd.setScale(2, RoundingMode.HALF_UP);

            // Convert the clean, rounded value back to Double
            finalBalances.put(userId, bd.doubleValue());
        }

        return finalBalances;
    }

    public List<SettlementResult> calculateSettlements(Long groupId) {

        List<Expense> expenses = expenseRepository.findAllByGroupId(groupId);

        // 1️⃣ Calculate balances
        Map<Long, Double> balances = calculateGroupBalances(groupId);

        // 2️⃣ Build user lookup
        Group group = groupRepository.findById(groupId).orElseThrow();
        Map<Long, User> userMap = new HashMap<>();
        for (User u : group.getUsers()) {
            userMap.put(u.getId(), u);
        }

        // 3️⃣ Split creditors and debtors
        List<Map.Entry<Long, Double>> creditors = balances.entrySet()
                .stream()
                .filter(e -> e.getValue() > 0)
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .collect(Collectors.toList());

        List<Map.Entry<Long, Double>> debtors = balances.entrySet()
                .stream()
                .filter(e -> e.getValue() < 0)
                .sorted((a, b) -> Double.compare(a.getValue(), b.getValue()))
                .collect(Collectors.toList());

        List<SettlementResult> settlements = new ArrayList<>();
        int i = 0, j = 0;

        // 4️⃣ Create structured settlement objects
        while (i < creditors.size() && j < debtors.size()) {
            Long creditorId = creditors.get(i).getKey();
            Long debtorId = debtors.get(j).getKey();

            double credit = creditors.get(i).getValue();
            double debit = -debtors.get(j).getValue();

            double settleAmount = Math.min(credit, debit);

            String note = userMap.get(debtorId).getUsername() +
                    " owes " + userMap.get(creditorId).getUsername() +
                    " ₹" + settleAmount;

            settlements.add(
                    new SettlementResult(
                            debtorId,
                            userMap.get(debtorId).getUsername(),
                            creditorId,
                            userMap.get(creditorId).getUsername(),
                            settleAmount,
                            note
                    )
            );

            creditors.get(i).setValue(credit - settleAmount);
            debtors.get(j).setValue(-(debit - settleAmount));

            if (credit - settleAmount == 0) i++;
            if (debit - settleAmount == 0) j++;
        }

        return settlements;
    }

}
