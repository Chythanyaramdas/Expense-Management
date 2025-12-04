package com.example.project.controller;

import com.example.project.dto.SettlementRequest;
import com.example.project.dto.SettlementResult;
import com.example.project.model.Settlement;
import com.example.project.service.ExpenseService;
import com.example.project.service.SettlementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping
public class SettlementController {

    @Autowired
    private SettlementService settlementService;

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("/settle")
    public Settlement settle(@RequestBody SettlementRequest req) {

        return settlementService.recordSettlement(
                req.getGroupId(),
                req.getPayerId(),
                req.getReceiverId(),
                req.getAmount()
        );
    }

    @GetMapping("/settlements/{groupId}")
    public List<SettlementResult> history(@PathVariable Long groupId) {

        return expenseService.calculateSettlements(groupId);
    }

}

