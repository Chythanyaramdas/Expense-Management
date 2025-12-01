//package model;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "SETTLEMENTS")
//public class Settlement {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    @JoinColumn(name = "payer_id", nullable = false)
//    private User payer;
//
//    @ManyToOne
//    @JoinColumn(name = "receiver_id", nullable = false)
//    private User receiver;
//
//    @Column(nullable = false)
//    private Double amount;
//
//    @ManyToOne
//    @JoinColumn(name = "group_id", nullable = false)
//    private Group group;
//
//    @Column(nullable = false, updatable = false)
//    private LocalDateTime timestamp = LocalDateTime.now();
//
//    public Long getId() { return id; }
//
//    public User getPayer() { return payer; }
//    public void setPayer(User payer) { this.payer = payer; }
//
//    public User getReceiver() { return receiver; }
//    public void setReceiver(User receiver) { this.receiver = receiver; }
//
//    public Double getAmount() { return amount; }
//    public void setAmount(Double amount) { this.amount = amount; }
//
//    public Group getGroup() { return group; }
//    public void setGroup(Group group) { this.group = group; }
//
//    public LocalDateTime getTimestamp() { return timestamp; }
//}
