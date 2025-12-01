package com.example.project.dto;


public class SettlementRequest {
    private Long groupId;
    private Long payerId;
    private Long receiverId;
    private Double amount;

    public SettlementRequest() {}

    public Long getGroupId() { return groupId; }
    public Long getPayerId() { return payerId; }
    public Long getReceiverId() { return receiverId; }
    public Double getAmount() { return amount; }

    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public void setPayerId(Long payerId) { this.payerId = payerId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
    public void setAmount(Double amount) { this.amount = amount; }
}



