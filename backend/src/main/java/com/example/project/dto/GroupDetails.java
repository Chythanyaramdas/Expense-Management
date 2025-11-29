package com.example.project.dto;

import com.example.project.model.User;
import java.util.List;
import java.util.Map;

public class GroupDetails {

    private Long id;
    private String name;
    private List<User> members;
    private Map<Long, Double> balances;

    public Map<Long, Double> getBalances() {
        return balances;
    }

    public void setBalances(Map<Long, Double> balances) {
        this.balances = balances;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<User> getMembers() {
        return members;
    }

    public void setMembers(List<User> members) {
        this.members = members;
    }
}
