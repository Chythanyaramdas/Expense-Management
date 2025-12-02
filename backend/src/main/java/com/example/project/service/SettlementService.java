package com.example.project.service;


import com.example.project.model.Expense;
import com.example.project.model.Group;
import com.example.project.model.Settlement;
import com.example.project.model.User;
import com.example.project.repository.ExpenseRepository;
import com.example.project.repository.GroupRepository;
import com.example.project.repository.SettleRepository;
import com.example.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class SettlementService {

    @Autowired
    SettleRepository settlementRepository;

    @Autowired
    ExpenseRepository expenseRepository;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ExpenseService expenseService;

    public Settlement recordSettlement(Long groupId, Long payerId, Long receiverId, Double amount) {

        User payer = userRepository.findById(payerId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();

        // Create settlement entry
        Settlement s = new Settlement();
        s.setPayer(payer);
        s.setReceiver(receiver);
        s.setAmount(amount);
        s.setGroup(group);
        s.setCreatedAt(LocalDateTime.now());

        // Create human-readable message
        String message = payer.getUsername() + " paid " + receiver.getUsername() + " ₹" + amount;
        s.setNote(message);

        settlementRepository.save(s);

        // Add reverse expense for balance adjustment
        addReverseExpense(group, payer, receiver, amount);

        return s;
    }

    private void addReverseExpense(Group group, User payer, User receiver, Double amount) {
        Expense expense = new Expense();
        expense.setGroup(group);
        expense.setTitle("Settlement Payment");
        expense.setSplitType("EXACT");
        expense.setAmount(amount);
        expense.setPayer(payer);

        expense.setParticipants(List.of(receiver));
        expense.setUserShares(Map.of(receiver.getId(), amount));

        expenseRepository.save(expense);
    }
}
