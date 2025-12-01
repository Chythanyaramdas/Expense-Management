//package controller;
//
//
//import dto.ExpenseRquest;
//import model.Expense;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//import service.ExpenseService;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/expense")
//public class ExpenseController {
//
//    @Autowired
//    private ExpenseService expenseService;
//
//    @PostMapping("/add")
//    public Expense addExpense(@RequestBody ExpenseRquest request) {
//        return expenseService.addExpense(
//                request.getGroupId(),
//                request.getTitle(),
//                request.getTotalAmount(),
//                request.getPaidById(),
//                request.getSplitType(),
//                request.getParticipantIds(),
//                request.getExactShares()
//        );
//    }
//
//    @GetMapping("/group/{groupId}")
//    public List<Expense> getExpenses(@PathVariable Long groupId) {
//        return expenseService.getExpensesByGroup(groupId);
//    }
//
//    @GetMapping("/balances/{groupId}")
//    public Map<Long, Double> getBalances(@PathVariable Long groupId) {
//        return expenseService.calculateGroupBalances(groupId);
//    }
//
//    @GetMapping("/settlements/{groupId}")
//    public List<String> getSettlements(@PathVariable Long groupId) {
//        return expenseService.calculateSettlements(groupId);
//    }
//
//}
