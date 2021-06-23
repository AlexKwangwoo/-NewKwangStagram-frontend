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
import { Link, useHistory, useParams } from "react-router-dom";
import useUser from "../hooks/useUser";
import routes from "../routes";
import Avatar from "./Avatar";
import letter from "../asset/letterB.png";
import { useForm } from "react-hook-form";
import { useState } from "react";
import NotificationScreen from "./NotificationScreen";

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
  /* margin: auto; */
`;

const Wrapper = styled.div`
  position: absolute;
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
    padding-left: 10px;
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

const NotificationBox = styled.div`
  position: absolute;
  top: 28px;
  right: 0;
  width: 500px;
  height: 300px;
`;

const Line = styled.div`
  width: 10px;
  height: 10px;
  /* padding-bottom: -20px; */
  margin-left: auto;
  margin-top: 8px;
  margin-right: 49px;
  transform: rotate(45deg);
  border-top: 2px #d9dcdf solid;
  border-left: 2px #d9dcdf solid;
  border-bottom: none;
  border-right: none;
  background-color: white;
  z-index: 10;
  /* box-shadow: 0px 0px 3px #aaacaf; */
`;

const Notification = styled.div`
  margin-top: -3px;
  width: 100%;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0px 0px 3px #aaacaf;
  background-color: white;
`;

function Header() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const history = useHistory();
  const onCompleted = (data) => {};
  const [selectHeader, setSelectHeader] = useState();
  const { data } = useUser();
  const {
    register,
    handleSubmit,
    errors,
    formState,
    watch,
    getValues,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  const onSubmitValid = (data) => {
    const { searchWord } = getValues();
    // console.log("data", data);
    // console.log("searchWord", searchWord);
    // const {
    //   createAccount: { ok, error },
    // } = data;
    // if (!ok) {
    //   return;
    // }

    history.push(`/search/${searchWord}`, {
      searchWord,
    });
  };

  const setSelectHeaderNone = () => {
    setSelectHeader("");
  };

  const selectHeaderState = (header) => {
    if (selectHeader === "heart") {
      setSelectHeader("");
    } else {
      setSelectHeader("heart");
    }
  };

  console.log(selectHeader);

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
            {watch("searchWord") === "" ? (
              <IconSearch>
                <FontAwesomeIcon icon={faSearch} size="md" />
              </IconSearch>
            ) : null}

            <form onSubmit={handleSubmit(onSubmitValid)}>
              <Input
                ref={register({
                  required: "Search Word Is Required.",
                })}
                // value={watch("searchWord")}
                name="searchWord"
                type="text"
                // onChangeText={(text) => setValue("searchWord", text)}
                placeholder="Search"
                onChangeText={(text) => setValue("searchWord", text)}
              />
            </form>
          </SearchBox>
        </Column>
        <Column>
          {isLoggedIn ? (
            <IconsContainer>
              <Link to={"/"} onClick={() => setSelectHeaderNone()}>
                <Icon>
                  <FontAwesomeIcon icon={faHome} size="lg" />
                </Icon>
              </Link>
              <Link to={"/"} onClick={() => setSelectHeaderNone()}>
                <Icon>
                  <FontAwesomeIcon icon={faPaperPlane} size="lg" />
                </Icon>{" "}
              </Link>
              <Link to={"/explore"} onClick={() => setSelectHeaderNone()}>
                <Icon>
                  <FontAwesomeIcon icon={faCompass} size="lg" />
                </Icon>
              </Link>
              <Link>
                <Icon>
                  <FontAwesomeIcon
                    onClick={() => selectHeaderState("heart")}
                    icon={faHeart}
                    size="lg"
                  />
                </Icon>
              </Link>
              <Icon onClick={() => setSelectHeaderNone()}>
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
        {selectHeader === "heart" ? (
          <NotificationBox>
            <Line></Line>
            <Notification>
              <NotificationScreen setSelectHeaderNone={setSelectHeaderNone} />
            </Notification>
          </NotificationBox>
        ) : null}
      </Wrapper>
    </SHeader>
  );
}
export default Header;
