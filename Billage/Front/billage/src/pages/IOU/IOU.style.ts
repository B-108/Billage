import styled from 'styled-components';
import theme from '/src/themes';
import Image from '/src/components/Common/Image';

export const WatermarkContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`;

export const WatermarkImage = styled(Image)`
    opacity: 0.3; /* 이미지의 투명도 조절 */
`;

export const WatermarkText = styled.div`
    position: absolute;
    margin: 10px;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: ${theme.fontSize.XXS_10};
    opacity: 0.3;
    /* 텍스트의 높이와 여백 조절 */
    height: auto; /* 자동 높이 설정 */
    max-height: 100%; /* 최대 높이 설정 */
    overflow: hidden; /* 넘치는 부분 감추기 */
    white-space: normal; /* 줄 바꿈을 허용 */
    text-overflow: ellipsis; /* 넘치는 텍스트를 생략 부호(...)로 표시 */
    display: inline-block; /* 인라인 블록 요소로 설정 */
    width: 60%; /* 가로 길이 100%로 설정 */
`;

export const IOUContainer = styled.div`
    width: 100%;
    height: 100%;
    border-color: #000000;
    border-style: solid;
    position: relative;
`;

export const IOUContent = styled.div`
    padding: 20px;
    z-index: 1;
`;

export const Title = styled.p`
    font-size: ${theme.fontSize.L_24};
    margin: 30px;
    text-align: center;
`;

export const Amount = styled.div`
    font-size: ${theme.fontSize.M_20};
    margin: 10px;
`;

export const Content = styled.div`
    font-size: ${theme.fontSize.S_14};
    margin: 10px;
`;

export const Dates = styled.div`
    font-size: ${theme.fontSize.S_14};
    margin: 10px;
    text-align: center;
`;