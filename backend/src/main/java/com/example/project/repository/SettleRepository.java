package com.example.project.repository;


import com.example.project.model.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettleRepository extends JpaRepository<Settlement, Long> {
    @Query("SELECT s FROM Settlement s " +
            "LEFT JOIN FETCH s.payer " +
            "LEFT JOIN FETCH s.receiver " +
            "WHERE s.group.id = :groupId")
    List<Settlement> findAllByGroupId(@Param("groupId") Long groupId);
    void deleteAllByGroupId(Long groupId);
}

