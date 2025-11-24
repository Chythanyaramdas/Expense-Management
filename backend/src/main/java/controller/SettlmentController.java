package controller;

import model.Settlement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import service.SettlementService;

import java.util.List;

@RestController
@RequestMapping
public class SettlmentController {

    @Autowired
    private SettlementService settlementService;

    @PostMapping("/settle")
    public Settlement settle(
            @RequestParam Long groupId,
            @RequestParam Long payerId,
            @RequestParam Long receiverId,
            @RequestParam Double amount
    ) {
        return settlementService.recordSettlement(groupId, payerId, receiverId, amount);
    }

    @GetMapping("/settle/history/{groupId}")
    public List<Settlement> history(@PathVariable Long groupId) {
        return settlementService.getSettlements(groupId);
    }

}
