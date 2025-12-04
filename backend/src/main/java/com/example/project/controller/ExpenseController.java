package com.example.project.controller;

import com.example.project.dto.ExpenseRequest;
import com.example.project.dto.SettlementResult;
import com.example.project.model.Expense;
import com.example.project.service.ExpenseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/expense")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("/add")
    public Expense addExpense(@RequestBody ExpenseRequest request) {

        return expenseService.addExpense(
                request.getGroupId(),
                request.getTitle(),
                request.getTotalAmount(),
                request.getPaidById(),
                request.getSplitType(),
                request.getParticipantIds(),
                request.getExactShares()
        );
    }

    @GetMapping("/group/{groupId}")
    public List<Expense> getExpenses(@PathVariable Long groupId) {

        return expenseService.getExpensesByGroup(groupId);
    }

    @GetMapping("/balances/{groupId}")
    public Map<Long, Double> getBalances(@PathVariable Long groupId) {

        return expenseService.calculateGroupBalances(groupId);
    }

    @GetMapping("/settlements/{groupId}")
    public List<SettlementResult> getSettlements(@PathVariable Long groupId) {

        return expenseService.calculateSettlements(groupId);
    }
}
