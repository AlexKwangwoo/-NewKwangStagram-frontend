import styled from "styled-components";
import Header from "./Header";

const Content = styled.main`
  margin: 0 auto;
  margin-top: 45px;
  max-width: 930px;
  width: 100%;
  /* background-color: red; */
`;

const MainContainer = styled.div`
  width: 100%;
`;

function Layout({ children }) {
  return (
    <MainContainer>
      <Header />
      <Content>{children}</Content>
    </MainContainer>
  );
}

export default Layout;
