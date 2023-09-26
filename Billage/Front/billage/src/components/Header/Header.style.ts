import styled from "styled-components"
import theme from "/src/themes";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 94%;
  height: 80px;
`

export const LeftSection = styled.div`
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  height: 80px;
  line-height: 80px;
  width: 50%;

`;

export const Title = styled.div<{ $noDisplay:boolean }>`
  display: flex;
  width: 90%;
  height: 80px;
  line-height: 84px;
  font-weight: 800;
  font-size: ${theme.fontSize.M_20};
  padding: ${(props) => props.$noDisplay ? "0px" : "0px 0px 0px 7px"};

`