import { useReactiveVar } from "@apollo/client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faCompass,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { faHome, faPlane, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { isLoggedInVar } from "../apollo";
import { Link } from "react-router-dom";
import useUser from "../hooks/useUser";
import routes from "../routes";
import Avatar from "./Avatar";
import letter from "../asset/letterB.png";

const SHeader = styled.header`
  top: 0;
  right: 0;
  z-index: 2;
  position: fixed;
  width: 100%;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  padding: 18px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  max-width: 930px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.div``;

const Icon = styled.span`
  margin-left: 20px;
  cursor: point;
`;

const Button = styled.span`
  background-color: ${(props) => props.theme.accent};
  border-radius: 4px;
  padding: 4px 15px;
  color: white;
  font-weight: 600;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LetterImg = styled.img`
  max-width: 70%;
  margin-bottom: -10px;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  padding: 5px 15px;
  background-color: #fafafa;
  border: 0.5px solid
    ${(props) => (props.hasError ? "tomato" : props.theme.borderColor)};
  /* 만약 애러가있다면 빨간색 테두리!! */
  margin-top: 5px;
  box-sizing: border-box;
  &::placeholder {
    font-size: 12px;
    text-align: center;
    color: #aaacaf;
    padding-left: 20px;
  }
  &:focus {
    border-color: rgb(38, 38, 38);
  }
`;

const SearchBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconSearch = styled.div`
  position: absolute;
  margin-top: 7px;
  margin-right: 60px;
  color: #aaacaf;
`;

function Header() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data } = useUser();

  return (
    <SHeader>
      <Wrapper>
        <Column>
          <Link to={"/"}>
            <LetterImg src={letter} />
          </Link>
        </Column>
        <Column>
          <SearchBox>
            <IconSearch>
              <FontAwesomeIcon icon={faSearch} size="md" />
            </IconSearch>
            <Input name="search" type="search" placeholder="Search" />
          </SearchBox>
        </Column>
        <Column>
          {isLoggedIn ? (
            <IconsContainer>
              <Link to={"/"}>
                <Icon>
                  <FontAwesomeIcon icon={faHome} size="lg" />
                </Icon>
              </Link>
              <Link to={"/"}>
                <Icon>
                  <FontAwesomeIcon icon={faPaperPlane} size="lg" />
                </Icon>{" "}
              </Link>
              <Link to={"/explore"}>
                <Icon>
                  <FontAwesomeIcon icon={faCompass} size="lg" />
                </Icon>
              </Link>
              <Link to={"/"}>
                <Icon>
                  <FontAwesomeIcon icon={faHeart} size="lg" />
                </Icon>
              </Link>
              <Icon>
                <Link to={`/users/${data?.me?.username}`}>
                  <Avatar url={data?.me?.avatar} />
                </Link>
              </Icon>
            </IconsContainer>
          ) : (
            <Link href={routes.home}>
              <Button>Login</Button>
            </Link>
          )}
        </Column>
      </Wrapper>
    </SHeader>
  );
}
export default Header;
