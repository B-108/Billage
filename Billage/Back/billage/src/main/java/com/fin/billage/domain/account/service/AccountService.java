package com.fin.billage.domain.account.service;

import com.fin.billage.domain.account.dto.AccountRequestDto;
import com.fin.billage.domain.account.dto.AccountResponseDto;
import com.fin.billage.domain.account.entity.Account;
import com.fin.billage.domain.account.repository.AccountRepository;
import com.fin.billage.domain.user.entity.User;
import com.fin.billage.domain.user.repository.UserRepository;
import com.fin.billage.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    // 내 계좌 등록
    public Account addMyAccount(AccountRequestDto dto, HttpServletRequest request) {
        Long user_pk = jwtUtil.extractUserPkFromToken(request);
        User user = userRepository.findById(user_pk).orElse(null);

        boolean mainYn = false;
        //주 계좌가 없을 때 주계좌 설정
        List<Account> userMainAccounts = accountRepository.findByUserAndAccountMainYn(user, true);

        if (userMainAccounts.isEmpty()) {
            mainYn = true;
        }

        // 이미 존재하는 은행의 계좌가 있을 떄 중복방지
        Account existAccount = accountRepository.findByUserAndAccountNumAndAccountBankCode(user, dto.getAccountNum(), dto.getAccountBankCode());

        if (existAccount != null) {
            // 이미 등록된 계좌가 존재하면 실패
            return null;
        }

        Account account = Account.builder()
                .user(user)
                .accountBankCode(dto.getAccountBankCode())
                .accountNum(dto.getAccountNum())
                .accountRegistDate(LocalDateTime.now())
                .accountMainYn(mainYn)
                .build();


        accountRepository.save(account);
        return account;
    }

    // 내 계좌 리스트 조회
    public List<AccountResponseDto> searchMyAccount(HttpServletRequest request) {
        Long user_pk = jwtUtil.extractUserPkFromToken(request);
        User user = userRepository.findById(user_pk).orElse(null);
        List<Account> accounts = accountRepository.findAllByUser(user).orElseThrow();
        List<AccountResponseDto> dtos = new ArrayList<>();

        for (Account account : accounts) {
            AccountResponseDto dto = AccountResponseDto.builder()
                    .accountId(account.getAccountId())
                    .accountBankCode(account.getAccountBankCode())
                    .accountNum(account.getAccountNum())
                    .accountRegistDate(account.getAccountRegistDate())
                    .accountMainYn(account.getAccountMainYn())
                    .build();

            dtos.add(dto);
        }

        return dtos;
    }

    // 주 계좌 등록
    public Account addMyMainAccount(Long account_id, HttpServletRequest request) {
        Long user_pk = jwtUtil.extractUserPkFromToken(request);
        User user = userRepository.findById(user_pk).orElse(null);

        // 기존 주계좌 찾아서 false로 바꿔주기
        Account mainAccount = accountRepository.findByUserAndAccountMainYnIsTrue(user).orElseThrow();

        if (mainAccount != null) {
            mainAccount.updateAccountMainYn(false);
            accountRepository.save(mainAccount);
        }

        // 주계좌로 설정
        Account account = accountRepository.findByUserAndAccountId(user, account_id).orElseThrow();
        if (account != null) {
            account.updateAccountMainYn(true);
            accountRepository.save(account);
        }

        return account;
    }

    // 등록된 계좌 삭제처리
    public Account deleteMyAccount(Long account_id, HttpServletRequest request) {
        Long user_pk = jwtUtil.extractUserPkFromToken(request);
        User user = userRepository.findById(user_pk).orElse(null);
        Account account = accountRepository.findByUserAndAccountId(user, account_id).orElseThrow();

        account.deleteAccount();
        accountRepository.save(account);

        return account;
    }
}
