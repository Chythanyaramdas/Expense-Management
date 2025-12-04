package com.example.project.dto;

import java.util.List;

public class CreateGroupRequest {
    public String name;
    public List<Long> userIds;
    public Long creatorId;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<Long> getUserIds() { return userIds; }
    public void setUserIds(List<Long> userIds) { this.userIds = userIds; }

    public Long getCreatorId() { return creatorId; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }
}
