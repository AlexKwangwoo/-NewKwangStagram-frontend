import styled from "styled-components";

const Button2 = styled.input`
  border: none;
  border-radius: 3px;
  background-color: ${(props) => props.theme.accent};
  color: white;
  text-align: center;
  padding: 8px 0px;
  font-weight: 600;
  width: 100px;
  opacity: ${(props) => (props.disabled ? "0.2" : "1")};
`;

// function Button(props) {
//   return <SButton {...props} />;
// }
export default Button2;
