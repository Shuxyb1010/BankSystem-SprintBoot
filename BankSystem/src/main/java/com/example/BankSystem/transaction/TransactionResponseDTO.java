package com.example.BankSystem.transaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseDTO {
    private String message;
    private double accountFromBalance;
    private double accountToBalance;
}
