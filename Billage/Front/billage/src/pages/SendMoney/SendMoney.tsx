import Input, { ButtonInput } from '/src/components/Common/Input';
import React, { useState, useEffect, useContext } from 'react';
import CenteredContainer from '/src/components/Common/CenterAlign';
import Header from '/src/components/Header/Header';
import Button from '/src/components/Common/Button';
import { ButtonContainer, InputDiv, InputTitle, SmallButtonsContainer } from './SendMoney.style';
import { useNavigate, useLocation } from 'react-router-dom';

import { getAccountList } from '/src/api/account';
import { AccountType } from '/src/type/account';
import ConfirmBox from '/src/components/Common/YesOrNo';

//이체
import { SendMoneyType } from '/src/type/transaction';
import ConfirmContext from '/src/context/confirm/ConfirmContext';

function SendMoney() {
    const navigate = useNavigate();
    const location = useLocation();
    const sendData = location.state.data
    const handleGoBack = () => {navigate(-1);};
    
    // console.log(sendData)
    //작성 취소 버튼 클릭시 활성
    // const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false); // 다이얼로그 상태 추가
    // 이체 필요 데이터
    //거래ID
    const [transId, setTransId] = useState<number>(0);
    //보내는 사람(tranWd)
    const [transWd, setTransWd] = useState<string>('');
    //보내는 사람 계좌/은행 코드(tranWdAcNum, tranWdBankCode)
    const [myAccountInfo, setMyAccountInfo] = useState<string>('');
    const [myAccountInfoCode, setMyAccountInfoCode] = useState<string>('');
    //받는 사람(tranDp)
    const [friendInfo, setFriendInfo] = useState<string>('');
    //받는 사람 계좌/은행 코드(tranDpAcNum, tranDpBankCode)
    const [accountInfo, setAccountInfo] = useState<string>('');
    const [accountInfoCode, setAccountInfoCode] = useState<string>('');
    //금액(tranAmt)
    const [amount, setAmountInfo] = useState<string>('0');

    // console.log(location.state)
    //내 계좌 목록
    const [accounts, setAccounts] = useState<AccountType[]>([]);

    //Axios
    // 전체 계좌조회
    const axiosAccountList = async (): Promise<void> => {
        try {
            const response = await getAccountList();
            setAccounts(response?.data);
            // console.log(response?.data);
        } catch (error) {
            console.log(error);
        }
    };
    //이체
    const data: SendMoneyType = {
        contractId: transId,
        tranWd: transWd,
        tranWdAcNum: myAccountInfo,
        tranWdBankCode: myAccountInfoCode,
        tranDp: friendInfo,
        tranDpAcNum: accountInfo,
        tranDpBankCode: accountInfoCode,
        tranAmt: Number(amount),
        tranContent: '돈보내기',
    };
    //useEffect
    useEffect(() => {
        axiosAccountList();
        setTransId(sendData.contractId);
        setTransWd(sendData.debtorUser.userName);
        setFriendInfo(sendData.creditorUser.userName);
        setAccountInfo(sendData.creditorAcNum);
        setAccountInfoCode(sendData.creditorBankCode);
    }, []);

    useEffect(() => {
        const mainAccount = accounts.find((account) => account.accountMainYn === true);
        if (mainAccount) {
            setMyAccountInfo(mainAccount.accountNum);
            setMyAccountInfoCode(mainAccount.accountBankCode);
        }
    }, [accounts]);

    //함수
    const handleCancelClick = () => {
      openConfirm()
    };

    // const handleConfirmCancel = () => {
    //     setIsCancelDialogOpen(false);
    // };

    const moveToPinEnter = () => {
        navigate('/pinenter/sendmoney', { state: data });
    };

    const handleMyAccountInfoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMyAccountInfo(event.target.value);
    };
    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value === " ") {
          setAmountInfo("0")
        }
        else {
          setAmountInfo(event.target.value);
        }
    };
    const handleButtonClick = (increment: number) => {
        setAmountInfo((prevAmount) => (parseInt(prevAmount) + increment).toString());
    };

      // ConFirm 모달 창
      const { confirm: confirmComp } = useContext(ConfirmContext);

      const onConfirmClick = async (text: string) => {
        const result = await confirmComp(text);
        return result;
      };
  
      const openConfirm = async () => {
        const nextAction = await onConfirmClick("작성을 취소하시겠습니까?");
        if (nextAction) {
          handleGoBack()
        }
        return;
      };

    return (
        <CenteredContainer>
            <Header headerTitle="이체하기"></Header>
            <InputDiv>
                <InputTitle>돈 받을 사람</InputTitle>
                <ButtonInput value={friendInfo} $active $size="88%,40px" disabled />
            </InputDiv>
            <hr />
            <InputDiv>
                <InputTitle>상대방 계좌</InputTitle>
                <ButtonInput value={accountInfo} $active $size="88%,40px" disabled />
            </InputDiv>
            <hr />
            <InputDiv style={{alignItems:"center"}}>
              <InputTitle>내 계좌</InputTitle>
                <select
                value={myAccountInfo}
                onChange={handleMyAccountInfoChange}
                style={{
                  width : '95%', 
                  height: '40px', 
                  borderRadius: '10px', 
                  border: '3px solid #BDBDBD'}}>
                {accounts.map((account) => (
                    <option
                        key={account.accountId}
                        value={account.accountNum}>
                        {account.accountNum}
                    </option>))}
                </select>
            </InputDiv>
            <hr />

            <InputDiv style={{ alignItems: 'center' }}>
                <InputTitle>보내는 금액</InputTitle>
                <Input value={Number(amount).toLocaleString()} $active $size="88%,40px" $position onChange={handleAmountChange}></Input>
                <SmallButtonsContainer>
                  <Button style={{margin:"7px 0px 0px 5px"}}
                    $smallBlackBtn 
                    $size="18%,25px"
                    onClick={() => handleButtonClick(10000)}
                    >+1만
                  </Button>
                  <Button style={{margin:"7px 0px 0px 5px"}}
                    $smallBlackBtn $size="18%,25px"
                    onClick={() => handleButtonClick(50000)}
                    >+5만
                  </Button>
                  <Button style={{margin:"7px 0px 0px 5px"}}
                    $smallBlackBtn $size="18%,25px" 
                    onClick={() => handleButtonClick(100000)}
                    >+10만
                  </Button>
                  <Button style={{margin:"7px 0px 0px 5px"}}
                    $smallBlackBtn $size="18%,25px"
                    onClick={() => handleButtonClick(1000000)}
                    >+100만
                  </Button>
                </SmallButtonsContainer>
            </InputDiv>

            <hr />
            <InputDiv style={{ alignItems: 'center' }}>
                <InputTitle>남은 금액</InputTitle>
                <Input
                    value={(sendData.repaymentCash - Number(amount)).toLocaleString()}
                    $active
                    $size="88%,40px"
                    $position
                    disabled
                ></Input>
            </InputDiv>
            <hr />
            <ButtonContainer>
                <Button $basicGrayBtn $size="48%, 50px" onClick={handleCancelClick}>
                    작성취소
                </Button>
                <Button $basicGreenBtn $size="48%, 50px" onClick={moveToPinEnter}>
                    작성완료
                </Button>
            </ButtonContainer>
            {/* {isCancelDialogOpen && <ConfirmBox onCancel={handleConfirmCancel} onConfirm={() => navigate(-1)} />} */}
        </CenteredContainer>
    );
}

export default SendMoney;