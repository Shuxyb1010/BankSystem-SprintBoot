package com.example.BankSystem.transaction;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponseDTO> deposit(@RequestBody DepositWithdrawRequestDTO dto) {
        return ResponseEntity.ok(transactionService.deposit(dto.getAmount()));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponseDTO> withdraw(@RequestBody DepositWithdrawRequestDTO dto) {
        return ResponseEntity.ok(transactionService.withdraw(dto.getAmount()));
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponseDTO> transfer(@RequestBody TransactionRequestDTO dto) {
        return ResponseEntity.ok(transactionService.transfer(dto));
    }

    @GetMapping("/history")
    public ResponseEntity<List<TransactionResponseDTO>> getTransactionHistory() {
        log.info("GET /api/transactions/history called");
        try {
            List<TransactionResponseDTO> history = transactionService.getTransactionHistory();
            log.info("Successfully retrieved {} transactions", history.size());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error getting transaction history: {}", e.getMessage(), e);
            throw e;
        }
    }
}
