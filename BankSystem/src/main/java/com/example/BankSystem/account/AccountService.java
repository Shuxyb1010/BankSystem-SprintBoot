package com.example.BankSystem.account;

import com.example.BankSystem.user.User;
import com.example.BankSystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public List<AccountResponseDTO> getAccounts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Account> accounts = accountRepository.findByUser(user);
        
        return accounts.stream()
                .map(account -> {
                    AccountResponseDTO dto = new AccountResponseDTO();
                    dto.setAccountNumber(account.getAccountNumber());
                    dto.setBalance(account.getBalance());
                    dto.setUsername(account.getUser().getUsername());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public AccountResponseDTO createAccount(AccountRequestDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String accountNumber = UUID.randomUUID().toString().substring(0,12);

        Account account = new Account();
        account.setAccountNumber(accountNumber);
        account.setBalance(dto.getInitialBalance());
        account.setUser(user);

        Account saved = accountRepository.save(account);

        AccountResponseDTO response = new AccountResponseDTO();
        response.setAccountNumber(saved.getAccountNumber());
        response.setBalance(saved.getBalance());
        response.setUsername(saved.getUser().getUsername());

        return response;
    }
}
