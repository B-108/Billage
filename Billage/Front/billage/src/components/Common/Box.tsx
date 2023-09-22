import React from 'react'

import styled, {css} from "styled-components"
import theme from '/src/themes';

interface BoxProps {
    children?: React.ReactNode;
    onClick?: () => void;
    
    type?: '';

    // 사이즈 지정
    $size? : string;

    // 상자 종류
    $alarmBox? : boolean;
    $mainTransaction? : boolean;
    $transaction? : boolean;
}

const StyledBox = styled.div<BoxProps>`
    font-size: ${theme.fontSize.DF_16};
    width: ${(props) => props.$size?.split(',')[0]};
    height: ${(props) => props.$size?.split(',')[1]};
    
    // 메인에서 alarm창을 위한 box
    ${(props) =>
        props.$alarmBox && 
        css`
          display: flex;
          padding: 3%;
          margin: 0px 0px 20px 0px;
          flex-direction: column;
          border-radius: ${theme.radius.S_10};
          box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.25);
        `
    }

    // greanGradient 사용 예시
    // border-image: ${theme.color.mix.border};
    // border-image-slice: 1;

    // 메인에서 거래 카드형식
    ${(props) =>
        props.$mainTransaction && 
        css`
          border-radius: ${theme.radius.M_15};
          background: ${theme.color.mix.background};
        `
    }

    // 메인에서 거래 관련 box
    ${(props) =>
        props.$transaction && 
        css`

        `
    }
`

const Box = (props:BoxProps) => {
    return <StyledBox {...props}></StyledBox>
}

export default Box