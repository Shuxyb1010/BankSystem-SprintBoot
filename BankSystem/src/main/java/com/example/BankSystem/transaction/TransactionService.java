package com.example.BankSystem.transaction;

import com.example.BankSystem.account.Account;
import com.example.BankSystem.account.AccountRepository;
import com.example.BankSystem.user.User;
import com.example.BankSystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionResponseDTO deposit(double amount) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        Account to = accountRepository.findAll()
                .stream()
                .filter(a -> a.getUser().equals(user))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No account found for user"));

        to.setBalance(to.getBalance() + amount);
        accountRepository.save(to);

        transactionRepository.save(new Transaction(null, "DEPOSIT", amount, LocalDateTime.now(), null, to));

        return new TransactionResponseDTO("Deposit successful", 0, to.getBalance());
    }

    public TransactionResponseDTO withdraw(double amount) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        Account from = accountRepository.findAll()
                .stream()
                .filter(a -> a.getUser().equals(user))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No account found for user"));

        if (from.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        from.setBalance(from.getBalance() - amount);
        accountRepository.save(from);

        transactionRepository.save(new Transaction(null, "WITHDRAW", amount, LocalDateTime.now(), from, null));

        return new TransactionResponseDTO("Withdrawal successful", from.getBalance(), 0);
    }

    public TransactionResponseDTO transfer(TransactionRequestDTO dto) {
        // Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        // Find both accounts
        Account from = accountRepository.findByAccountNumber(dto.getAccountFrom())
                .orElseThrow(() -> new RuntimeException("Sender account not found"));

        Account to = accountRepository.findByAccountNumber(dto.getAccountTo())
                .orElseThrow(() -> new RuntimeException("Recipient account not found"));

        // Ensure sender owns the source account
        if (!from.getUser().equals(user)) {
            throw new AccessDeniedException("You can only transfer from your own account.");
        }

        // Check balance
        if (from.getBalance() < dto.getAmount()) {
            throw new RuntimeException("Insufficient balance");
        }

        // Perform transaction
        from.setBalance(from.getBalance() - dto.getAmount());
        to.setBalance(to.getBalance() + dto.getAmount());

        accountRepository.saveAll(List.of(from, to));

        transactionRepository.save(new Transaction(null, "TRANSFER", dto.getAmount(), LocalDateTime.now(), from, to));

        return new TransactionResponseDTO("Transfer successful", from.getBalance(), to.getBalance());
    }

    public List<TransactionResponseDTO> getTransactionHistory() {
        log.info("getTransactionHistory() called");
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Username from authentication: {}", username);
        
        User user = userRepository.findByUsername(username).orElseThrow();
        log.info("Found user: {}", user.getUsername());

        List<Account> userAccounts = accountRepository.findAll()
                .stream()
                .filter(a -> a.getUser().equals(user))
                .collect(Collectors.toList());
        
        log.info("Found {} accounts for user: {}", userAccounts.size(), username);

        List<Transaction> transactions = transactionRepository.findAll()
                .stream()
                .filter(t -> userAccounts.contains(t.getAccountFrom()) || userAccounts.contains(t.getAccountTo()))
                .collect(Collectors.toList());
        
        log.info("Found {} transactions for user: {}", transactions.size(), username);

        List<TransactionResponseDTO> result = transactions.stream()
                .map(t -> {
                    String message = String.format("%s - Amount: $%.2f", t.getType(), t.getAmount());
                    double fromBalance = t.getAccountFrom() != null ? t.getAccountFrom().getBalance() : 0;
                    double toBalance = t.getAccountTo() != null ? t.getAccountTo().getBalance() : 0;
                    return new TransactionResponseDTO(message, fromBalance, toBalance);
                })
                .collect(Collectors.toList());
        
        log.info("Returning {} transaction DTOs", result.size());
        return result;
    }
}
