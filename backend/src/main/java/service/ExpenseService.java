package service;

import model.Expense;
import model.Group;
import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.ExpenseRepository;
import repository.GroupRepository;
import repository.UserRepository;

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

    public Expense addExpense(Long groupId, String title, Double totalAmount, Long paidById,
                              String splitType, List<Long> participantIds, Map<Long, Double> exactShares) {

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

        if ("EQUAL".equalsIgnoreCase(splitType)) {
            double share = totalAmount / participants.size();
            Map<Long, Double> shares = participants.stream()
                    .collect(Collectors.toMap(User::getId, u -> share));
            expense.setUserShares(shares);
        } else if ("EXACT".equalsIgnoreCase(splitType)) {
            expense.setUserShares(exactShares);
        }

        return expenseRepository.save(expense);
    }

    public List<Expense> getExpensesByGroup(Long groupId) {
        return expenseRepository.findAllByGroupId(groupId);
    }

    public Map<Long, Double> calculateGroupBalances(Long groupId) {

        List<Expense> expenses = expenseRepository.findAllByGroupId(groupId);
        Map<Long, Double> balances = new HashMap<>();

        for (Expense expense : expenses) {
            Long payerId = expense.getPayer().getId();
            Double amount = expense.getAmount();
            balances.put(payerId, balances.getOrDefault(payerId, 0.0) + amount);

            for (Map.Entry<Long, Double> entry : expense.getUserShares().entrySet()) {
                Long userId = entry.getKey();
                Double share = entry.getValue();

                balances.put(userId, balances.getOrDefault(userId, 0.0) - share);
            }
        }

        return balances;
    }

    public List<String> calculateSettlements(Long groupId) {

        Map<Long, Double> balances = calculateGroupBalances(groupId);
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

        List<String> settlements = new ArrayList<>();

        int i = 0, j = 0;

        while (i < creditors.size() && j < debtors.size()) {

            Long creditorId = creditors.get(i).getKey();
            Long debtorId = debtors.get(j).getKey();

            double credit = creditors.get(i).getValue();
            double debit = -debtors.get(j).getValue();

            double settled = Math.min(credit, debit);

            settlements.add(
                    "User " + debtorId + " owes User " + creditorId + " ₹" + settled
            );

            creditors.get(i).setValue(credit - settled);
            debtors.get(j).setValue(-(debit - settled));

            if (credit - settled == 0) i++;
            if (debit - settled == 0) j++;
        }

        return settlements;
    }

}
