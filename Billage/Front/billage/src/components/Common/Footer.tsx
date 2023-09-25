import React from 'react'
import home from '/src/assets/homeButton.svg'
import account from '/src/assets/creditCard.svg'
import hamburger from '/src/assets/hamburger.svg'
import Image from './Image'
import styled from "styled-components"
import { useNavigate } from 'react-router-dom'

interface TextProps {
    children?: React.ReactNode;
    disabled?: boolean;    

    // 사이즈 설정
    $size ?: string

    // 마진 지정
    $margin ?:boolean
}

const StyledText = styled.span<TextProps>`
  ${(props) =>
    props.$margin &&
    `
        margin: 0%;
    `}
    display: block; // 블록 요소로 변경
    text-align : center;
    vertical-align: bottom; // 텍스트를 아래로 정렬
`;

const Text = (props:TextProps) => {
    return <StyledText {...props}> {props.children} </StyledText>
}

const FooterContainer = styled.div`
  display: flex;
  height: 65px;
  /* height: 7vh; */
  justify-content: space-around;
  align-items: end; 
  margin-top: auto;
  background-color: white;
  box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.1); // 그림자 스타일 추가

  @media only screen and (max-width: 5000px) {
    width: 400px;
  }
  @media only screen and (max-width: 400px) {
    width: 99%;
  }
`;

function Footer(){
  // 라우터
  const navigate = useNavigate()
  const moveMain = () => {navigate(`/main`)}
  const moveAccounts = () => {navigate(`/myaccounts`)}

  return (
    <FooterContainer>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: 'auto' }}>
        <div >
          <Image 
            src={home} 
            alt="home" 
            width="30px"
            onClick={moveMain}></Image>
          <Text>홈</Text>
        </div>
        <div>
          <Image 
            src={account} 
            alt="account" 
            width="30px"
            onClick={moveAccounts}></Image>
          <Text>계좌</Text>
        </div>
        <div>
          <Image src={hamburger} alt="hamburger" width="32px"></Image>
          <Text>설정</Text>
        </div>
      </div>
    </FooterContainer>
  );
}

export default Footer