//package repository;
//import model.Expense;
//import model.Group;
//import model.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface ExpenseRepository extends JpaRepository<Expense, Long> {
//
//    List<Expense> findAllByGroup(Group group);
//
//    List<Expense> findAllByPayer(User payer);
//
//    List<Expense> findAllByGroupId(Long groupId);
//
//    List<Expense> findAllByPayerId(Long payerId);
//}
