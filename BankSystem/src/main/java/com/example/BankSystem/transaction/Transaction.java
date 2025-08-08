package com.example.BankSystem.transaction;

import com.example.BankSystem.account.Account;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions") // recommended: avoid reserved word "transaction"
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // DEPOSIT, WITHDRAWAL, TRANSFER
    private double amount;
    private LocalDateTime timestamp;

    @ManyToOne
    private Account accountFrom;

    @ManyToOne
    private Account accountTo;
}
