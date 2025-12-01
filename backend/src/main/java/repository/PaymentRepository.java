//package repository;
//
//import model.Settlement;
//import model.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface PaymentRepository extends JpaRepository<Settlement, Long> {
//
//    List<Settlement> findAllByGroupId(Long groupId);
//
//    List<Settlement> findAllByPayer(User payer);     // optional, if needed
//    List<Settlement> findAllByReceiver(User receiver); // optional, if needed
//}
//
