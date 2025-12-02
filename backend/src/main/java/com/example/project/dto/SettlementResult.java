package com.example.project.dto;

public class SettlementResult {

    private Long payerId;
    private String payerName;
    private Long receiverId;
    private String receiverName;
    private Double amount;
    private String note;

    public SettlementResult(Long payerId, String payerName,
                            Long receiverId, String receiverName,
                            Double amount, String note) {

        this.payerId = payerId;
        this.payerName = payerName;
        this.receiverId = receiverId;
        this.receiverName = receiverName;
        this.amount = amount;
        this.note = note;
    }

    public Long getPayerId() { return payerId; }
    public String getPayerName() { return payerName; }
    public Long getReceiverId() { return receiverId; }
    public String getReceiverName() { return receiverName; }
    public Double getAmount() { return amount; }
    public String getNote() { return note; }
}


