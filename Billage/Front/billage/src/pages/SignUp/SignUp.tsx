import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// 이미지
import logo from 'src/assets/logo.png'

// 재사용 컴포넌트
import CenteredContainer from "/src/components/Common/CenterAlign";
import Text from "/src/components/Common/Text";
import Input from "/src/components/Common/Input"
import Button from "/src/components/Common/Button"
import Image from "/src/components/Common/Image";
import theme from "/src/themes";

// 스타일 컴포넌트  
import { 
  ButtonBox, 
  InputDiv, 
  InputHeader } from "/src/components/Common/Input"

// 리코일 
import { useRecoilState } from "recoil";
import { 
  NameState, 
  PhoneState } from "/src/recoil/auth";

// 타입스크립트
import { 
  MessageCertProps,
  MessageProps } from "/src/type/auth";

// API
import { 
  getPhoneCheck, 
  postMessage, 
  postMessageCert } from "/src/api/auth";
import AlertSimpleContext from "/src/context/alertSimple/AlertSimpleContext";

function SignUp(){
  const [name, setName] = useRecoilState<string>(NameState);
  const [phone, setPhone] = useRecoilState<string>(PhoneState);
  const [certNum, setCertNum] = useState<string>('');
  const [isEnd, setIsEnd] = useState(false);
  
  const MAX_LENGTH = 20;

  // 라우터 
  const navigate = useNavigate()
  const moveLogin = () => {navigate(`/`)}
  const movePinRegister = () => {navigate(`/pinregister`)} 
  
  // 이름 입력
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(!isNaN(Number(event.target.value[event.target.value.length-1]))) {return}

    if (event.target.value.length > MAX_LENGTH) {
      event.target.value = event.target.value.slice(0, MAX_LENGTH);
    }
    setName(event.target.value.split(' ').join(''));
  };

  // 전화번호 입력
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(isNaN(Number(event.target.value))) {return}

    if (event.target.value.length > MAX_LENGTH) {
      event.target.value = event.target.value.slice(0, MAX_LENGTH);
    }
    setPhone(event.target.value.split(' ').join(''));
  };

  // 인증번호
  const handleCertNumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(isNaN(Number(event.target.value))) {return}

    if (event.target.value.length > MAX_LENGTH) {
      event.target.value = event.target.value.slice(0, MAX_LENGTH);
    }
    setCertNum(event.target.value.split(' ').join(''));
  };

  const messageRequest = () => {
    onAlertSimpleClick("인증번호를 요청했습니다.")
    axiosMessage()
  }

  const messageCertification = async () => {
    const responseMessage = await axiosMessagCert()
    // 이름 입력 확인
    if (!name) {
      onAlertSimpleClick("이름을 입력해주세요")
      return
    }
    
    // 문자인증 확인
    if (responseMessage !== 200) {
      onAlertSimpleClick("문자 인증 번호를 확인해주세요")
      return
    }
    
    await movePinRegister()
  }

  // 문자인증 번호요청
  const axiosMessage = async (): Promise<void> => {
    const responsePhonecheck = await axiosPhoneCheck()

    // 전화번호로 이미 회원인지 판정
    if (responsePhonecheck) { 
      onAlertSimpleClick("이미 회원입니다.")
      return 
    }
    const info: MessageProps = {
      to : phone,
    }
    try {
      await postMessage(info)
    }
    catch(error) {
      console.log(error)
    }
  }

  // 문자 인증 요청
  const axiosMessagCert = async (): Promise<number|undefined> => {
    const info: MessageCertProps = {
      phoneNumber : phone,
      verifyNumber : certNum
    }
    try {
      return await postMessageCert(info)
    }
    catch(error) {
      console.log(error)
    }
  }

  // 회원 인증 요청
  const axiosPhoneCheck = async (): Promise<object|undefined>  => {
    try {
      const response = await getPhoneCheck(phone)
      return response
    }
    catch(error) {
      console.log(error)
    }
  }

  const HandleIsEnd = useCallback(() => {
    setIsEnd(!isEnd);
  }, [isEnd]);

  const { alert: alertSimpleComp } = useContext(AlertSimpleContext);
  
  const onAlertSimpleClick = async (text: string) => {
    const result = await alertSimpleComp(text);
    console.log("custom", result);
    HandleIsEnd();
  };

  return(
    <CenteredContainer $center>
      <Image src={logo} alt="로고" width="120px"></Image>
      
      <Text
        $mainText
        $size="60%,">Billage에 오신걸 환영합니다!</Text>

      <InputDiv style={{marginBottom : '1rem'}}>
        <InputHeader>이름</InputHeader>
        <Input
          type="name"
          value={name}
          $size="86%,40px"
          $active
          onChange={handleNameChange}/>
          
      </InputDiv>

      <InputDiv style={{ marginBottom: '1rem' }}>
        <InputHeader>핸드폰 번호</InputHeader>
        <Input
          type="phone"
          value={phone}
          $size="86%,40px"
          $active
          onChange={handlePhoneChange}/>
      
        <ButtonBox>
          <Button
            $smallGreenBtn
            $size="26%,30px"
            onClick={messageRequest}>전송
          </Button>
        </ButtonBox>
      </InputDiv>

      <InputDiv style={{marginBottom : '1rem'}}>
        <InputHeader>인증 번호</InputHeader>
        <Input
          type="number"
          value={certNum}
          $size="86%,40px"
          $active
          onChange={handleCertNumChange}/>
      </InputDiv>
              
      <Button 
        $basicGreenBtn 
        $size="91%,43px" 
        $Green
        onClick={messageCertification}>가입 하기</Button>

      <div 
        style={{ 
          fontSize: theme.fontSize.XS_12, 
          color:theme.color.gray[55], 
          marginTop: '1rem'}}>
        <span onClick={moveLogin} >이미 회원이신가요? 로그인하기</span>
      </div>
    </CenteredContainer>
  )
}
export default SignUp