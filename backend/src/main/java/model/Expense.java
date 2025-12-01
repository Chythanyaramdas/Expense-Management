//package model;
//
//import com.example.project.model.User;
//import jakarta.persistence.*;
//
//import java.util.List;
//import java.util.Map;
//
//@Entity
//@Table(name = "EXPENSES")
//public class Expense {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable=false)
//    private String title;
//
//    @Column(nullable=false)
//    private Double amount;
//
//    @Column(nullable = false)
//    private String splitType;
//
//
//    @ManyToMany
//    @JoinTable(
//            name = "expense_participants",
//            joinColumns = @JoinColumn(name="expense_id"),
//            inverseJoinColumns = @JoinColumn(name="user_id")
//    )
//    private List<User> participants;
//
//
//    @ElementCollection
//    @CollectionTable(name = "expense_shares", joinColumns = @JoinColumn(name = "expense_id"))
//    @MapKeyColumn(name = "user_id")
//    @Column(name = "share")
//    private Map<Long, Double> userShares;
//
//    @ManyToOne
//    @JoinColumn(name = "group_id")
//    private Group group;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User payer;
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getTitle() {
//        return title;
//    }
//
//    public void setTitle(String title) {
//        this.title = title;
//    }
//
//    public Double getAmount() {
//        return amount;
//    }
//
//    public void setAmount(Double amount) {
//        this.amount = amount;
//    }
//
//    public String getSplitType() {
//        return splitType;
//    }
//
//    public void setSplitType(String splitType) {
//        this.splitType = splitType;
//    }
//
//    public List<User> getParticipants() {
//        return participants;
//    }
//
//    public void setParticipants(List<User> participants) {
//        this.participants = participants;
//    }
//
//    public Map<Long, Double> getUserShares() {
//        return userShares;
//    }
//
//    public void setUserShares(Map<Long, Double> userShares) {
//        this.userShares = userShares;
//    }
//
//    public Group getGroup() {
//        return group;
//    }
//
//    public void setGroup(Group group) {
//        this.group = group;
//    }
//
//    public User getPayer() {
//        return payer;
//    }
//
//    public void setPayer(User payer) {
//        this.payer = payer;
//    }
//}
