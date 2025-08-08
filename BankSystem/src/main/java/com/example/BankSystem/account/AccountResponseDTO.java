package com.example.BankSystem.account;

import lombok.Data;

@Data
public class AccountResponseDTO {
    private String accountNumber;
    private double balance;
    private String username;
}
