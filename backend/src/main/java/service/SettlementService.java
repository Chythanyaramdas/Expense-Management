//package service;
//
//import model.Expense;
//import model.Group;
//import model.User;
//import model.Settlement;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import repository.ExpenseRepository;
//import repository.GroupRepository;
//import repository.PaymentRepository;
//import repository.UserRepository;
//
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class SettlementService {
//
//    @Autowired
//    PaymentRepository settlementRepository;
//
//    @Autowired
//    ExpenseRepository expenseRepository;
//
//    @Autowired
//    GroupRepository groupRepository;
//
//    @Autowired
//    UserRepository userRepository;
//
//    @Autowired
//    ExpenseService expenseService;
//
//    public Settlement recordSettlement(Long groupId, Long payerId, Long receiverId, Double amount) {
//
//        Group group = groupRepository.findById(groupId).orElseThrow();
//        User payer = userRepository.findById(payerId).orElseThrow();
//        User receiver = userRepository.findById(receiverId).orElseThrow();
//
//        // 1️⃣ Save audit entry
//        Settlement settlement = new Settlement();
//        settlement.setGroup(group);
//        settlement.setPayer(payer);
//        settlement.setReceiver(receiver);
//        settlement.setAmount(amount);
//
//        settlementRepository.save(settlement);
//
//        addReverseExpense(group, payer, receiver, amount);
//
//        return settlement;
//    }
//
//    private void addReverseExpense(Group group, User payer, User receiver, Double amount) {
//
//        Expense expense = new Expense();
//        expense.setGroup(group);
//        expense.setTitle("Settlement Payments");
//        expense.setSplitType("EXACT");
//        expense.setAmount(amount);
//        expense.setPayer(payer);
//
//        expense.setParticipants(List.of(receiver));
//        expense.setUserShares(Map.of(receiver.getId(), amount));
//
//        expenseRepository.save(expense);
//    }
//
//    public List<Settlement> getSettlements(Long groupId) {
//        return settlementRepository.findAllByGroupId(groupId);
//    }
//}
//
