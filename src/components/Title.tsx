import styled from "styled-components";

const Title = styled.div`
  font-style: ${({ fontStyle }) => (fontStyle ? fontStyle : "normal")};
  font-size: ${({ fontSize }) => (fontSize ? fontSize : "1rem")};
`;

export default Title;
