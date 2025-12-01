//package service;
//
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import repository.GroupRepository;
//import repository.UserRepository;
//
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class GroupService {
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
//
//    public Group createGroup(String name, List<Long> userIds) {
//        Group group = new Group();
//        group.setName(name);
//
//        List<User> users = userRepository.findAllById(userIds);
//        group.setUsers(users);
//
//        return groupRepository.save(group);
//    }
//
//
//    public Group addUserToGroup(Long groupId,Long userId){
//        Group group=groupRepository.findById(groupId).orElseThrow();
//        User user=userRepository.findById(userId).orElseThrow();
//        group.getUsers().add(user);
//        return groupRepository.save(group);
//    }
//    public GroupDetails getGroupDetails(Long groupId) {
//
//        Group group = groupRepository.findById(groupId).orElseThrow();
//        Map<Long, Double> balances = expenseService.calculateGroupBalances(groupId);
//
//        GroupDetails dto = new GroupDetails();
//        dto.setId(group.getId());
//        dto.setName(group.getName());
//        dto.setMembers(group.getUsers());
//        dto.setBalances(balances);
//
//        return dto;
//    }
//
//    public Group removeUserFromGroup(Long groupId, Long userId) {
//        Group group = groupRepository.findById(groupId).orElseThrow();
//        User user = userRepository.findById(userId).orElseThrow();
//
//        group.getUsers().remove(user);
//        return groupRepository.save(group);
//    }
//
//
//    public List<Group> getGroupForUser(Long userId){
//       User user =userRepository.findById(userId).orElseThrow();
//       return groupRepository.findAllByUsersContaining(user);
//    }
//}
