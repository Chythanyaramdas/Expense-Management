package com.example.project.repository;


import com.example.project.model.Expense;
import com.example.project.model.Group;
import com.example.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByGroup(Group group);

    List<Expense> findAllByPayer(User payer);

    List<Expense> findAllByGroupId(Long groupId);

    List<Expense> findAllByPayerId(Long payerId);
}
