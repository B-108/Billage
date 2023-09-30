package com.fin.bank.kb.domain.netAmount.service;

import com.fin.bank.kb.domain.netAmount.entity.BankList;
import com.fin.bank.kb.domain.netAmount.entity.NetAmount;
import com.fin.bank.kb.domain.netAmount.enums.TransactionStatus;
import com.fin.bank.kb.domain.netAmount.repository.BankListRepository;
import com.fin.bank.kb.domain.transfer.entity.Transaction;
import com.fin.bank.kb.domain.transfer.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NetAmountService {

    private final TransactionRepository transactionRepository;
    private final BankListRepository bankListRepository;

    @Scheduled(fixedDelay = 1000) // 1초마다 실행
    public void scheduleCalculateNetAmountForAllBanks() {
        calculateNetAmountForAllBanks();
    }

    public void calculateNetAmountForAllBanks() {

        // 각 은행들의 은행 코드를 가져온다.
        List<String> bankCodes = bankListRepository.findAll().stream()
                .map(BankList::getBankCode)
                .collect(Collectors.toList());

        // 모든 은행 코드에 대한 처리를 반복한다.
        for (String bankCode : bankCodes) {
            // 해당 은행의 deposit(입금) 거래 기록을 가져온다.
            List<Transaction> depositTransactions = transactionRepository.findByTranTypeAndTranWdBankCode("DEPOSIT", bankCode);

            // 해당 은행의 withdraw(출금) 거래 기록을 가져온다.
            List<Transaction> withdrawalTransactions = transactionRepository.findByTranTypeAndTranWdBankCode("WITHDRAWAL", bankCode);

            // 해당 은행의 입금 금액 합계를 계산한다.
            BigDecimal totalDeposit = calculateTotalDeposit(depositTransactions);

            // 해당 은행의 출금 금액 합계를 계산한다.
            BigDecimal totalWithdrawal = calculateTotalWithdrawal(withdrawalTransactions);

            // 최종 차액을 계산하고 상태를 업데이트한다.
            NetAmount netAmount = new NetAmount(totalDeposit, totalWithdrawal);

            BigDecimal netAmountValue= calculateNetAmountValue(totalDeposit, totalWithdrawal);
            netAmount.updateNetAmoundAndStatus(netAmountValue, netAmount.getStatus());

        }
    }

    // 거래 상태에 따라 상태를 저장하고 차액을 결정하는 메서드
    private BigDecimal calculateNetAmountValue(BigDecimal totalDeposit, BigDecimal totalWithdrawal){
        // 거래 상태를 결정한다.
        TransactionStatus status;
        // 입금이 출금보다 클 경우, 돈을 받아야하는 상태이다.
        if (totalDeposit.compareTo(totalWithdrawal) > 0) {
            status = TransactionStatus.RECEIVE;
            return totalDeposit.subtract(totalWithdrawal);
        }
        // 출금이 입금보다 클 경우, 돈을 보내야하는 상태이다.
        else if (totalDeposit.compareTo(totalWithdrawal) < 0) {
            status = TransactionStatus.SEND;
            return totalWithdrawal.subtract(totalDeposit);
        }
        // 출금과 입금이 동일한 경우, 돈이 이동할 필요가 없는 상태이다.
        else {
            status = TransactionStatus.NONE;
            return BigDecimal.ZERO;
        }
    }

    // 해당 은행의 deposit 거래 기록을 합산하는 메서드
    private BigDecimal calculateTotalDeposit(List<Transaction> depositTransactions) {
        // 합산된 입금 금액을 저장하기 위한 BigDecimal 변수를 초기화합니다.
        BigDecimal totalDeposit = BigDecimal.ZERO;

        // depositTransactions 리스트에 있는 모든 거래 기록을 반복합니다.
        for (Transaction transaction : depositTransactions) {
            // 각 거래 기록의 입금 금액 (tranAmt)을 totalDeposit에 더합니다.
            totalDeposit = totalDeposit.add(transaction.getTranAmt());
        }

        // 모든 입금 금액을 합산한 결과를 반환합니다.
        return totalDeposit;
    }


    // 해당 은행의 withdrawal 거래 기록을 합산하는 메서드
    private BigDecimal calculateTotalWithdrawal(List<Transaction> withdrawalTransactions) {
        BigDecimal totalDeposit = BigDecimal.ZERO;
        for (Transaction transaction : withdrawalTransactions) {
            totalDeposit = totalDeposit.add(transaction.getTranAmt());
        }
        return totalDeposit;
    }
}