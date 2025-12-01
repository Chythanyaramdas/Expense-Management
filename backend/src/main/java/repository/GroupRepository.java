//package repository;
//
//import model.Group;
//import model.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface GroupRepository extends JpaRepository<Group, Long> {
//
//    List<Group> findAllByUsersContaining(User user);
//    Optional<Group> findByName(String name);
//}
