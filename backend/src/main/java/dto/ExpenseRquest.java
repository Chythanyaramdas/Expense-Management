package dto;


import java.util.List;
import java.util.Map;

public class ExpenseRquest {

    private Long groupId;
    private String title;
    private Double totalAmount;
    private Long paidById;
    private String splitType; // EQUAL or EXACT
    private List<Long> participantIds;
    private Map<Long, Double> exactShares;  // used only for EXACT split

    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Long getPaidById() { return paidById; }
    public void setPaidById(Long paidById) { this.paidById = paidById; }

    public String getSplitType() { return splitType; }
    public void setSplitType(String splitType) { this.splitType = splitType; }

    public List<Long> getParticipantIds() { return participantIds; }
    public void setParticipantIds(List<Long> participantIds) { this.participantIds = participantIds; }

    public Map<Long, Double> getExactShares() { return exactShares; }
    public void setExactShares(Map<Long, Double> exactShares) { this.exactShares = exactShares; }
}
